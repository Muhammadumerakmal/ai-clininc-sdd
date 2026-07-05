import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { sendSuccess } from "../../shared/response.js";

export async function healthCheck(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const mongoState = mongoose.connection.readyState;
    const dbStatus = mongoState === 1 ? "connected" : "disconnected";

    sendSuccess(res, {
      status: "ok",
      timestamp: new Date().toISOString(),
      database: dbStatus,
      uptime: process.uptime(),
    });
  } catch (error) {
    next(error);
  }
}
