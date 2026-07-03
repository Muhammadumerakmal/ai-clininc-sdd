import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/error-handler.js";
import { rateLimit } from "./middleware/rate-limit.js";
import { auditLog } from "./middleware/audit.js";
import { logger } from "./config/logger.js";
import { env } from "./config/env.js";
import routes from "./routes/index.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(rateLimit as unknown as express.RequestHandler);
app.use(auditLog);

app.use("/api/v1", routes);

app.use(errorHandler);

logger.info("Express app configured");

export default app;
