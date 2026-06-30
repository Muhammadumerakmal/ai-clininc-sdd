import { Request, Response, NextFunction } from "express";
import { logger } from "../config/logger.js";

export function auditLog(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    if (shouldAudit(req.method, res.statusCode)) {
      logger.info({
        event: "api_request",
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration,
        userId: req.user?.userId,
        role: req.user?.role,
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      });
    }
  });

  next();
}

function shouldAudit(method: string, statusCode: number): boolean {
  if (statusCode >= 400) return true;
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) return true;
  return false;
}
