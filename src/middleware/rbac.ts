import { Request, Response, NextFunction } from "express";
import { ForbiddenError, UnauthorizedError } from "../shared/errors.js";

const roleHierarchy: Record<string, number> = {
  SuperAdmin: 100,
  ClinicAdmin: 80,
  Doctor: 60,
  Nurse: 50,
  Receptionist: 40,
  LabTechnician: 30,
  Pharmacist: 30,
  Patient: 10,
};

export function requireRole(...allowedRoles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new UnauthorizedError("Authentication required"));
      return;
    }

    const userRole = req.user.role;
    const userLevel = roleHierarchy[userRole] ?? 0;

    const hasAccess = allowedRoles.some((role) => {
      const requiredLevel = roleHierarchy[role] ?? 0;
      return userLevel >= requiredLevel;
    });

    if (!hasAccess) {
      next(new ForbiddenError(`Access denied. Required role: ${allowedRoles.join(" or ")}`));
      return;
    }

    next();
  };
}

export function requireClinicAccess(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) {
    next(new UnauthorizedError("Authentication required"));
    return;
  }

  if (req.user.role === "SuperAdmin") {
    next();
    return;
  }

  const clinicId = req.params.clinicId || req.body.clinicId || req.query.clinicId;

  if (clinicId && req.user.clinicId && clinicId !== req.user.clinicId) {
    next(new ForbiddenError("Access denied to this clinic's data"));
    return;
  }

  next();
}
