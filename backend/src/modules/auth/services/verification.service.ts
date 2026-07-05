import { TokenRepository } from "../repositories/token.repository.js";
import { AuthRepository } from "../repositories/auth.repository.js";
import { generateRandomToken } from "./token.service.js";
import { NotFoundError, ValidationError } from "../../../shared/errors.js";
import { hashPassword } from "./password.service.js";
import { logger } from "../../../config/logger.js";

const tokenRepo = new TokenRepository();
const authRepo = new AuthRepository();

export class VerificationService {
  async createEmailVerificationToken(userId: string): Promise<string> {
    const token = generateRandomToken();
    await tokenRepo.invalidateUserTokens(userId, "EMAIL_VERIFICATION");
    await tokenRepo.create({
      userId,
      token,
      type: "EMAIL_VERIFICATION",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    return token;
  }

  async verifyEmail(token: string): Promise<void> {
    const record = await tokenRepo.findByToken(token);
    if (!record || record.type !== "EMAIL_VERIFICATION") {
      throw new NotFoundError("Invalid verification token");
    }
    if (record.usedAt) {
      throw new ValidationError("Token already used");
    }
    if (record.expiresAt < new Date()) {
      throw new ValidationError("Token expired");
    }

    await authRepo.verifyEmail(record.userId);
    await tokenRepo.markAsUsed(record.id);

    logger.info({ event: "email_verified", userId: record.userId });
  }

  async createPasswordResetToken(email: string): Promise<string | null> {
    const user = await authRepo.findByEmail(email);
    if (!user) return null;

    const token = generateRandomToken();
    await tokenRepo.invalidateUserTokens(user.id, "PASSWORD_RESET");
    await tokenRepo.create({
      userId: user.id,
      token,
      type: "PASSWORD_RESET",
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });
    return token;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const record = await tokenRepo.findByToken(token);
    if (!record || record.type !== "PASSWORD_RESET") {
      throw new NotFoundError("Invalid reset token");
    }
    if (record.usedAt) {
      throw new ValidationError("Token already used");
    }
    if (record.expiresAt < new Date()) {
      throw new ValidationError("Token expired");
    }

    const passwordHash = await hashPassword(newPassword);
    await authRepo.updatePassword(record.userId, passwordHash);
    await tokenRepo.markAsUsed(record.id);

    logger.info({ event: "password_reset", userId: record.userId });
  }
}
