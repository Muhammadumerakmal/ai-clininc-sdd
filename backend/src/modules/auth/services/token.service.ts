import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { env } from "../../../config/env.js";

export interface TokenPayload {
  userId: string;
  role: string;
  clinicId?: string;
}

const accessOptions = { expiresIn: env.ACCESS_TOKEN_EXPIRY } as jwt.SignOptions;
const refreshOptions = { expiresIn: env.REFRESH_TOKEN_EXPIRY } as jwt.SignOptions;

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, accessOptions);
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, refreshOptions);
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, env.REFRESH_TOKEN_SECRET) as TokenPayload;
}

export function generateRandomToken(): string {
  return crypto.randomUUID();
}
