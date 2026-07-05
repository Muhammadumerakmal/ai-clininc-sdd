import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { UnauthorizedError } from "../shared/errors.js";

export interface JwtPayload {
  userId: string;
  role: string;
  clinicId?: string;
}

declare module "express" {
  interface Request {
    user?: JwtPayload;
  }
}

export function assertUser(user: JwtPayload | undefined): JwtPayload {
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const token = extractToken(req);

  if (!token) {
    next(new UnauthorizedError("Access token required"));
    return;
  }

  try {
    const payload = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as JwtPayload;
    req.user = payload;
    next();
  } catch {
    next(new UnauthorizedError("Invalid or expired access token"));
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = extractToken(req);

  if (!token) {
    next();
    return;
  }

  try {
    const payload = jwt.verify(token, env.ACCESS_TOKEN_SECRET) as JwtPayload;
    req.user = payload;
  } catch {
    // Token invalid, continue without user
  }
  next();
}

function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }

  if (req.cookies?.accessToken) {
    return req.cookies.accessToken;
  }

  return null;
}
