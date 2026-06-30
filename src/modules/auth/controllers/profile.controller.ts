import { Request, Response, NextFunction } from "express";
import { AuthRepository } from "../repositories/auth.repository.js";
import { sendSuccess, sendError } from "../../../shared/response.js";
import { hashPassword, verifyPassword } from "../services/password.service.js";
import { NotFoundError, ValidationError } from "../../../shared/errors.js";

const authRepo = new AuthRepository();

export async function getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await authRepo.findById(req.user!.userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    sendSuccess(res, {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isVerified: user.isVerified,
      clinicId: user.clinicId,
      createdAt: user.createdAt,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { name, email } = req.body;
    if (!name && !email) {
      throw new ValidationError("Nothing to update");
    }
    const user = await authRepo.updateProfile(req.user!.userId, { name, email });
    sendSuccess(res, { id: user.id, name: user.name, email: user.email });
  } catch (error) {
    next(error);
  }
}

export async function changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await authRepo.findById(req.user!.userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    const valid = await verifyPassword(currentPassword, user.passwordHash);
    if (!valid) {
      sendError(res, "Current password is incorrect", 400);
      return;
    }

    const newHash = await hashPassword(newPassword);
    await authRepo.updatePassword(user.id, newHash);
    sendSuccess(res, {}, "Password changed successfully");
  } catch (error) {
    next(error);
  }
}
