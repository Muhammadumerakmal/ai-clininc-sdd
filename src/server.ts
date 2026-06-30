import app from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";

async function main(): Promise<void> {
  await connectDatabase();

  app.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, `Server running on port ${env.PORT}`);
  });
}

main().catch(async (error) => {
  logger.fatal({ event: "server_startup_failed", error });
  await disconnectDatabase();
  process.exit(1);
});

process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down");
  await disconnectDatabase();
  process.exit(0);
});

process.on("SIGINT", async () => {
  logger.info("SIGINT received, shutting down");
  await disconnectDatabase();
  process.exit(0);
});
