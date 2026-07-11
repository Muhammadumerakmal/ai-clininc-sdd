import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ValidationError } from "../shared/errors.js";

interface ValidationSchemas {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
}

export function validate(schemas: ValidationSchemas) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        Object.defineProperty(req, "body", {
          value: schemas.body.parse(req.body),
          writable: true,
        });
      }
      if (schemas.params) {
        Object.defineProperty(req, "params", {
          value: schemas.params.parse(req.params) as Record<string, string>,
          writable: true,
        });
      }
      if (schemas.query) {
        Object.defineProperty(req, "query", {
          value: schemas.query.parse(req.query) as Record<string, string>,
          writable: true,
        });
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((e) => `${e.path.join(".")}: ${e.message}`);
        next(new ValidationError("Validation failed", errors));
      } else {
        next(error);
      }
    }
  };
}
