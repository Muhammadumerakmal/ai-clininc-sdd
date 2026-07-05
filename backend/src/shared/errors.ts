export class ApplicationError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends ApplicationError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

export class ValidationError extends ApplicationError {
  public errors: string[];

  constructor(message = "Validation failed", errors: string[] = []) {
    super(message, 400);
    this.errors = errors;
  }
}

export class UnauthorizedError extends ApplicationError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export class ForbiddenError extends ApplicationError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

export class ConflictError extends ApplicationError {
  constructor(message = "Conflict") {
    super(message, 409);
  }
}

export class InternalServerError extends ApplicationError {
  constructor(message = "Internal server error") {
    super(message, 500, false);
  }
}
