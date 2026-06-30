import { Request, Response, NextFunction } from "express";
import { ApplicationError } from "../shared/errors.js";
import { logger } from "../config/logger.js";
import { env } from "../config/env.js";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ApplicationError) {
    const response: Record<string, unknown> = {
      success: false,
      message: err.message,
    };

    if ("errors" in err && (err as ValidationError).errors?.length > 0) {
      response.errors = (err as ValidationError).errors;
    }

    if (!err.isOperational) {
      logger.error({ event: "unexpected_error", error: err.message, stack: err.stack });
    }

    res.status(err.statusCode).json(response);
    return;
  }

  logger.error({ event: "unhandled_error", error: err.message, stack: err.stack });

  res.status(500).json({
    success: false,
    message: env.NODE_ENV === "production" ? "Internal server error" : err.message,
  });
}

import { ValidationError } from "../shared/errors.js";
