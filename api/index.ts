import app from "../src/app.js";
import { connectDatabase } from "../src/config/database.js";
import { connectRedis } from "../src/config/redis.js";

let isConnected = false;

async function ensureConnections(): Promise<void> {
  if (isConnected) return;
  await Promise.all([connectDatabase(), connectRedis()]);
  isConnected = true;
}

export default async function handler(req: any, res: any) {
  await ensureConnections();
  return app(req, res);
}
