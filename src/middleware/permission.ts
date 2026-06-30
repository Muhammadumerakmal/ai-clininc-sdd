import { Request, Response, NextFunction } from "express";
import { ForbiddenError, UnauthorizedError } from "../shared/errors.js";

const permissions: Record<string, string[]> = {
  SuperAdmin: ["*"],
  ClinicAdmin: [
    "user:read", "user:write", "user:deactivate",
    "clinic:read", "clinic:write",
    "department:read", "department:write",
    "patient:read", "patient:write",
    "doctor:read", "doctor:write",
    "appointment:read", "appointment:write",
    "medical-record:read", "medical-record:write",
    "prescription:read", "prescription:write",
    "lab:read", "lab:write",
    "pharmacy:read", "pharmacy:write",
    "billing:read", "billing:write",
    "report:read",
    "notification:read", "notification:write",
    "ai:read", "ai:write",
  ],
  Doctor: [
    "patient:read", "patient:write",
    "appointment:read", "appointment:write",
    "medical-record:read", "medical-record:write",
    "prescription:read", "prescription:write",
    "lab:read", "lab:write",
    "ai:read", "ai:write",
    "notification:read",
  ],
  Nurse: [
    "patient:read", "patient:write",
    "appointment:read",
    "medical-record:read", "medical-record:write",
    "lab:read",
    "notification:read",
  ],
  Receptionist: [
    "patient:read", "patient:write",
    "appointment:read", "appointment:write",
    "notification:read",
  ],
  LabTechnician: [
    "patient:read",
    "lab:read", "lab:write",
    "notification:read",
  ],
  Pharmacist: [
    "prescription:read",
    "pharmacy:read", "pharmacy:write",
    "notification:read",
  ],
  Patient: [
    "patient:read",
    "appointment:read",
    "medical-record:read",
    "prescription:read",
    "billing:read",
    "notification:read",
    "ai:read",
  ],
};

export function requirePermission(...requiredPermissions: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError("Authentication required"));
      return;
    }

    const userPermissions = permissions[req.user.role] ?? [];

    if (userPermissions.includes("*")) {
      next();
      return;
    }

    const hasAccess = requiredPermissions.every((p) => userPermissions.includes(p));

    if (!hasAccess) {
      next(new ForbiddenError(`Insufficient permissions. Required: ${requiredPermissions.join(", ")}`));
      return;
    }

    next();
  };
}
