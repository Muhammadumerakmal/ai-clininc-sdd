import app from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { connectRedis, disconnectRedis } from "./config/redis.js";

async function main(): Promise<void> {
  await Promise.all([connectDatabase(), connectRedis()]);

  app.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, `Server running on port ${env.PORT}`);
  });
}

main().catch(async (error) => {
  logger.fatal({ event: "server_startup_failed", error });
  await Promise.all([disconnectDatabase(), disconnectRedis()]);
  process.exit(1);
});

async function shutdown(): Promise<void> {
  logger.info("Shutting down gracefully");
  await Promise.all([disconnectDatabase(), disconnectRedis()]);
  process.exit(0);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
