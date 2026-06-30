import { Request, Response, NextFunction } from "express";
import { VerificationService } from "../services/verification.service.js";
import { sendSuccess } from "../../../shared/response.js";

const verificationService = new VerificationService();

export async function verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { token } = req.body;
    await verificationService.verifyEmail(token);
    sendSuccess(res, {}, "Email verified successfully");
  } catch (error) {
    next(error);
  }
}

export async function resendVerification(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = await verificationService.createEmailVerificationToken(req.user!.userId);
    sendSuccess(res, { token }, "Verification email sent");
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email } = req.body;
    const token = await verificationService.createPasswordResetToken(email);

    if (token) {
      sendSuccess(res, { token }, "If that email exists, a reset link has been sent");
    } else {
      sendSuccess(res, {}, "If that email exists, a reset link has been sent");
    }
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { token, password } = req.body;
    await verificationService.resetPassword(token, password);
    sendSuccess(res, {}, "Password reset successfully");
  } catch (error) {
    next(error);
  }
}
