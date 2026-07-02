import jwt from "jsonwebtoken";
import { env } from "../../../config/env.js";

export interface TokenPayload {
  userId: string;
  role: string;
  clinicId?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const accessOptions: any = { expiresIn: env.ACCESS_TOKEN_EXPIRY };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const refreshOptions: any = { expiresIn: env.REFRESH_TOKEN_EXPIRY };

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
