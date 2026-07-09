/**
 * Express Application Setup
 *
 * Configures all global middleware, mounts route groups, and registers
 * the 404 catch-all and global error handler.
 */

import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { env } from "./config/env";
import { generalLimiter } from "./middlewares/rateLimiter";
import { errorHandler } from "./middlewares/errorHandler";
import { morganStream } from "./utils/logger";
import { ApiError } from "./utils/ApiError";

// Route imports
import authRoutes from "./routes/authRoutes";
import startupRoutes from "./routes/startupRoutes";
import socialRoutes from "./routes/socialRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import investmentRoutes from "./routes/investmentRoutes";
import meetingRoutes from "./routes/meetingRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import mentorRoutes from "./routes/mentorRoutes";
import chatRoutes from "./routes/chatRoutes";
import messageRoutes from "./routes/messageRoutes";
import postRoutes from "./routes/postRoutes";
import commentRoutes from "./routes/commentRoutes";
import competitionRoutes from "./routes/competitionRoutes";
import aiRoutes from "./routes/aiRoutes";

const app = express();

// ─── Security Headers ────────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true, // allow cookies (refresh token)
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ─── Compression ─────────────────────────────────────────────────────────────
app.use(compression());

// ─── Request Logging ─────────────────────────────────────────────────────────
app.use(
  morgan(env.NODE_ENV === "production" ? "combined" : "dev", {
    stream: morganStream,
  })
);

// ─── Body Parsing ────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── Cookie Parsing ──────────────────────────────────────────────────────────
app.use(cookieParser());

// ─── Rate Limiting ───────────────────────────────────────────────────────────
app.use(generalLimiter);

// ─── Health Check ────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Startup Pitch Hub API is running",
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/startups", startupRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/competitions", competitionRoutes);
app.use("/api/ai", aiRoutes);

// ─── 404 Catch-All ───────────────────────────────────────────────────────────
app.use((_req, _res, next) => {
  next(ApiError.notFound("The requested endpoint does not exist"));
});

// ─── Global Error Handler (must be last) ─────────────────────────────────────
app.use(errorHandler);

export default app;
