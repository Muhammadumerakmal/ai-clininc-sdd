import { AuthRepository } from "../repositories/auth.repository.js";
import { hashPassword, verifyPassword } from "./password.service.js";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "./token.service.js";
import { ConflictError, UnauthorizedError } from "../../../shared/errors.js";
import { logger } from "../../../config/logger.js";

const authRepo = new AuthRepository();

export class AuthService {
  async register(email: string, password: string, name: string, role: string) {
    const existing = await authRepo.findByEmail(email);
    if (existing) {
      throw new ConflictError("Email already registered");
    }

    const passwordHash = await hashPassword(password);
    const user = await authRepo.create({ email, passwordHash, name, role });

    logger.info({ event: "user_registered", userId: user.id, role: user.role });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  }

  async login(email: string, password: string) {
    const user = await authRepo.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    if (!user.isActive) {
      throw new UnauthorizedError("Account is deactivated");
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const payload = { userId: user.id, role: user.role, clinicId: user.clinicId ?? undefined };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await authRepo.updateRefreshToken(user.id, refreshToken);

    logger.info({ event: "user_logged_in", userId: user.id });

    return {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      accessToken,
      refreshToken,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = verifyRefreshToken(refreshToken);
      const user = await authRepo.findById(payload.userId);

      if (!user || !user.isActive) {
        throw new UnauthorizedError("Invalid refresh token");
      }

      const newPayload = { userId: user.id, role: user.role, clinicId: user.clinicId ?? undefined };
      const newAccessToken = generateAccessToken(newPayload);
      const newRefreshToken = generateRefreshToken(newPayload);

      await authRepo.updateRefreshToken(user.id, newRefreshToken);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch {
      throw new UnauthorizedError("Invalid or expired refresh token");
    }
  }

  async logout(userId: string): Promise<void> {
    await authRepo.updateRefreshToken(userId, null);
    logger.info({ event: "user_logged_out", userId });
  }
}
