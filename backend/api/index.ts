import app from "../src/app.js";
import { connectDatabase } from "../src/config/database.js";
import { connectRedis } from "../src/config/redis.js";

let isConnected = false;

async function ensureConnections(): Promise<void> {
  if (isConnected) return;
  try {
    await connectDatabase();
  } catch {
    // Database is optional — skip so root route still works (Vercel has no local MongoDB)
  }
  try {
    await connectRedis();
  } catch {
    // Redis is optional — skip silently (not available on Vercel serverless)
  }
  isConnected = true;
}

export default async function handler(req: any, res: any) {
  await ensureConnections();
  app(req, res);
}
