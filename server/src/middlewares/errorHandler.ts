/**
 * Global Error Handler Middleware
 *
 * Catches all errors that bubble up from route handlers and middlewares.
 * Normalises Mongoose, JWT, and Multer errors into a consistent JSON shape.
 */

import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { logger } from "../utils/logger";
import { isDev } from "../config/env";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (
  err: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = "Internal server error";
  let isOperational = false;

  // ── Known ApiError ────────────────────────────────────────────────────
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  }

  // ── Mongoose Validation Error ─────────────────────────────────────────
  else if (err.name === "ValidationError") {
    statusCode = 400;
    const mongooseErr = err as import("mongoose").Error.ValidationError;
    const messages = Object.values(mongooseErr.errors).map((e) => e.message);
    message = `Validation failed: ${messages.join(", ")}`;
    isOperational = true;
  }

  // ── Mongoose Duplicate Key Error ──────────────────────────────────────
  else if (
    err.name === "MongoServerError" &&
    (err as unknown as Record<string, unknown>).code === 11000
  ) {
    statusCode = 409;
    const keyValue = (err as unknown as Record<string, unknown>)
      .keyValue as Record<string, unknown>;
    const field = Object.keys(keyValue)[0];
    message = `A record with this ${field} already exists`;
    isOperational = true;
  }

  // ── Mongoose CastError (e.g. invalid ObjectId) ───────────────────────
  else if (err.name === "CastError") {
    statusCode = 400;
    const castErr = err as import("mongoose").Error.CastError;
    message = `Invalid value for ${castErr.path}: ${castErr.value}`;
    isOperational = true;
  }

  // ── JWT Errors ────────────────────────────────────────────────────────
  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
    isOperational = true;
  } else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token has expired";
    isOperational = true;
  }

  // ── Multer Errors (file upload) ───────────────────────────────────────
  else if (err.name === "MulterError") {
    statusCode = 400;
    message = err.message;
    isOperational = true;
  }

  // ── Logging ───────────────────────────────────────────────────────────

  if (!isOperational) {
    // Unexpected errors deserve full stack traces
    logger.error("Unhandled error:", err);
  } else {
    logger.warn(`${statusCode} – ${message}`);
  }

  // ── Response ──────────────────────────────────────────────────────────

  res.status(statusCode).json({
    success: false,
    message,
    // In development, include the stack for easier debugging
    ...(isDev && { stack: err.stack }),
  });
};
