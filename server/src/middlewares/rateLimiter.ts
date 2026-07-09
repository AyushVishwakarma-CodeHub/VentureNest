/**
 * Rate Limiter Middleware
 *
 * Exports several pre-configured limiters for different route groups.
 * Uses express-rate-limit backed by an in-memory store (sufficient for
 * single-instance deployments; swap to redis-store in production clusters).
 */

import rateLimit from "express-rate-limit";

/**
 * General limiter applied to all routes.
 * 100 requests per 15-minute window per IP.
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later",
  },
});

/**
 * Stricter limiter for authentication endpoints (login, register, etc.).
 * 20 requests per 15-minute window per IP.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later",
  },
});

/**
 * API limiter for general authenticated API calls.
 * 60 requests per minute per IP.
 */
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "API rate limit exceeded, please slow down",
  },
});
