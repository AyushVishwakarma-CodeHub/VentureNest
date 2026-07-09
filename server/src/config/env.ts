/**
 * Environment Configuration
 *
 * Uses Zod to validate and parse all environment variables at startup.
 * Provides sensible defaults for development so the app can run out of the box.
 * In production, missing required variables will cause an immediate, clear error.
 */

import dotenv from "dotenv";
import { z } from "zod";

// Load .env file before validation
dotenv.config();

const envSchema = z.object({
  // ── Server ──────────────────────────────────────────────────────────────
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().positive().default(5000),

  // ── Database ────────────────────────────────────────────────────────────
  MONGODB_URI: z
    .string()
    .url()
    .default("mongodb://localhost:27017/startup-pitch-hub"),

  // ── JWT ─────────────────────────────────────────────────────────────────
  JWT_ACCESS_SECRET: z
    .string()
    .min(16, "JWT_ACCESS_SECRET must be at least 16 characters")
    .default("dev-access-secret-change-in-prod"),
  JWT_REFRESH_SECRET: z
    .string()
    .min(16, "JWT_REFRESH_SECRET must be at least 16 characters")
    .default("dev-refresh-secret-change-in-prod"),
  JWT_ACCESS_EXPIRY: z.string().default("15m"),
  JWT_REFRESH_EXPIRY: z.string().default("7d"),

  // ── Client ──────────────────────────────────────────────────────────────
  CLIENT_URL: z.string().url().default("http://localhost:3000"),

  // ── Cloudinary ──────────────────────────────────────────────────────────
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  // ── Email (SMTP) ────────────────────────────────────────────────────────
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().default("noreply@startuppitchhub.com"),

  // ── Google OAuth ────────────────────────────────────────────────────────
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
});

/**
 * Parsed and validated environment configuration.
 * If validation fails, the process exits with a descriptive error.
 */
const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
  console.error(
    "❌  Invalid environment variables:\n",
    parseResult.error.flatten().fieldErrors
  );
  process.exit(1);
}

export const env = parseResult.data;

/** Convenience helpers */
export const isDev = env.NODE_ENV === "development";
export const isProd = env.NODE_ENV === "production";
export const isTest = env.NODE_ENV === "test";
