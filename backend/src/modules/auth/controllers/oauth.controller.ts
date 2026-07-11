import crypto from "node:crypto";
import { Request, Response, NextFunction } from "express";
import { OAuth2Client } from "google-auth-library";
import { User } from "../../../models/User.js";
import { env } from "../../../config/env.js";
import { AuthRepository } from "../repositories/auth.repository.js";
import { generateAccessToken, generateRefreshToken } from "../services/token.service.js";
import { hashPassword } from "../services/password.service.js";
import { sendSuccess, sendError } from "../../../shared/response.js";
import { logger } from "../../../config/logger.js";

const authRepo = new AuthRepository();
let googleClient: OAuth2Client | null = null;

function getGoogleClient(): OAuth2Client | null {
  if (googleClient) return googleClient;
  if (env.GOOGLE_CLIENT_ID) {
    googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);
    return googleClient;
  }
  return null;
}

export async function googleAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { idToken } = req.body;
    const client = getGoogleClient();

    if (!client) {
      sendError(res, "Google authentication is not configured", 501);
      return;
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.sub) {
      sendError(res, "Invalid Google token", 401);
      return;
    }

    let user = await authRepo.findByGoogleId(payload.sub);

    if (!user) {
      user = await authRepo.findByEmail(payload.email);

      if (user) {
        await User.findByIdAndUpdate(user.id, { googleId: payload.sub });
      } else {
        const passwordHash = await hashPassword(crypto.randomUUID());
        user = await authRepo.create({
          email: payload.email,
          passwordHash,
          name: payload.name || payload.email.split("@")[0],
          role: "Patient",
        });
        await User.findByIdAndUpdate(user.id, { googleId: payload.sub, isVerified: true });
      }
    }

    const tokenPayload = { userId: user.id, role: user.role, clinicId: user.clinicId ?? undefined };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    await authRepo.updateRefreshToken(user.id, refreshToken);

    logger.info({ event: "oauth_login", userId: user.id, provider: "google" });

    sendSuccess(res, {
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
}
