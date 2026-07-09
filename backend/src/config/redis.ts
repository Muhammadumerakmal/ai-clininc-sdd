import { createClient, RedisClientType } from "redis";
import { env } from "./env.js";
import { logger } from "./logger.js";

let client: RedisClientType;

export async function connectRedis(): Promise<RedisClientType> {
  client = createClient({ url: env.REDIS_URL, socket: { connectTimeout: 2000 } });

  client.on("error", (err) => logger.error({ event: "redis_error" }, err.message));
  client.on("connect", () => logger.info("Redis connected"));

  await client.connect();
  return client;
}

export function getRedis(): RedisClientType {
  return client;
}

export async function disconnectRedis(): Promise<void> {
  if (client) {
    await client.quit();
  }
}
