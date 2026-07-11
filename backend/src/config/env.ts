import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(8000),
  CORS: z.string().default("*"),
  MONGODB_URL: z.string().default(""),
  REDIS_URL: z.string().default("redis://localhost:6379"),
  ACCESS_TOKEN_SECRET: z.string().default(""),
  ACCESS_TOKEN_EXPIRY: z.string().default("1d"),
  REFRESH_TOKEN_SECRET: z.string().default(""),
  REFRESH_TOKEN_EXPIRY: z.string().default("7d"),
  MAILTRAP_SMTP_HOST: z.string().default("sandbox.smtp.mailtrap.io"),
  MAILTRAP_SMTP_PORT: z.coerce.number().default(2525),
  MAILTRAP_SMTP_USER: z.string().optional(),
  MAILTRAP_SMTP_PASS: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_CALLBACK_URL: z.string().default("http://localhost:8000/api/v1/auth/google/callback"),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  FRONTEND_URL: z.string().default("http://localhost:3000,http://localhost:5173"),
  QDRANT_URL: z.string().default("http://localhost:6333"),
  QDRANT_API_KEY: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
  if (!process.env.VERCEL) {
    process.exit(1);
  }
}

export const env: z.infer<typeof envSchema> = parsed.success ? parsed.data : envSchema.parse({});
