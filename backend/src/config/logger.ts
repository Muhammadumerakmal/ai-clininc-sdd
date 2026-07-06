import pino from "pino";
import { env } from "./env.js";

const isVercel = process.env.VERCEL === "1";
const isProd = env.NODE_ENV === "production" || isVercel;

const redactConfig = {
  paths: ["req.headers.authorization", "req.headers.cookie", "body.password", "body.currentPassword", "body.newPassword"],
  censor: "[REDACTED]",
};

export const logger = pino({
  level: isProd ? "info" : "debug",
  ...(isProd ? {} : { transport: { target: "pino-pretty" } }),
  redact: redactConfig,
});
