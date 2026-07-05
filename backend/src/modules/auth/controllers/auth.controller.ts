import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service.js";
import { sendSuccess, sendError } from "../../../shared/response.js";
import { env } from "../../../config/env.js";

const authService = new AuthService();

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password, name, role, clinicId } = req.body;
    const result = await authService.register(email, password, name, role, clinicId);
    sendSuccess(res, result, "Registration successful. Please verify your email.", 201);
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    const isProduction = env.NODE_ENV === "production";

    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      path: "/api/v1/auth/refresh",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    sendSuccess(res, { accessToken: result.accessToken, user: result.user }, "Login successful");
  } catch (error) {
    next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const token = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!token) {
      sendError(res, "Refresh token required", 401);
      return;
    }

    const result = await authService.refresh(token);

    const isProduction = env.NODE_ENV === "production";

    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    sendSuccess(res, { accessToken: result.accessToken }, "Token refreshed");
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user) {
      await authService.logout(req.user.userId);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken", { path: "/api/v1/auth/refresh" });

    sendSuccess(res, {}, "Logged out successfully");
  } catch (error) {
    next(error);
  }
}
