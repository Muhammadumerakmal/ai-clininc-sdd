import { Request, Response, NextFunction } from "express";
import { getRedis } from "../config/redis.js";
import { sendError } from "../shared/response.js";

const WINDOW_MS = 60;
const MAX_REQUESTS = 100;

export async function rateLimit(req: Request, res: Response, next: NextFunction): Promise<void> {
  const key = `ratelimit:${req.ip || "unknown"}`;
  const now = Math.floor(Date.now() / 1000);
  const windowStart = now - (now % WINDOW_MS);

  try {
    const redis = getRedis();
    const windowKey = `${key}:${windowStart}`;

    const count = await redis.incr(windowKey);
    if (count === 1) {
      await redis.expire(windowKey, WINDOW_MS);
    }

    res.setHeader("X-RateLimit-Limit", MAX_REQUESTS.toString());
    res.setHeader("X-RateLimit-Remaining", Math.max(0, MAX_REQUESTS - count).toString());
    res.setHeader("X-RateLimit-Reset", (windowStart + WINDOW_MS).toString());

    if (count > MAX_REQUESTS) {
      sendError(res, "Too many requests. Please try again later.", 429);
      return;
    }

    next();
  } catch {
    next();
  }
}
