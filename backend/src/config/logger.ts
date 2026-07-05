import pino from "pino";
import { env } from "./env.js";

export const logger = pino({
  level: env.NODE_ENV === "production" ? "info" : "debug",
  transport: env.NODE_ENV !== "production" ? { target: "pino-pretty" } : undefined,
  redact: {
    paths: ["req.headers.authorization", "req.headers.cookie", "body.password", "body.currentPassword", "body.newPassword"],
    censor: "[REDACTED]",
  },
});
