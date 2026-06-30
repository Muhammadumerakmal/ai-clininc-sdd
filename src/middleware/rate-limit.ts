import { Request, Response, NextFunction } from "express";
import { sendError } from "../shared/response.js";

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const store: RateLimitStore = {};

const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 100;

export function rateLimit(req: Request, res: Response, next: NextFunction): void {
  const key = req.ip || req.connection.remoteAddress || "unknown";
  const now = Date.now();

  if (!store[key] || store[key].resetTime < now) {
    store[key] = { count: 0, resetTime: now + WINDOW_MS };
  }

  store[key].count++;

  res.setHeader("X-RateLimit-Limit", MAX_REQUESTS.toString());
  res.setHeader("X-RateLimit-Remaining", Math.max(0, MAX_REQUESTS - store[key].count).toString());
  res.setHeader("X-RateLimit-Reset", Math.ceil(store[key].resetTime / 1000).toString());

  if (store[key].count > MAX_REQUESTS) {
    sendError(res, "Too many requests. Please try again later.", 429);
    return;
  }

  next();
}
