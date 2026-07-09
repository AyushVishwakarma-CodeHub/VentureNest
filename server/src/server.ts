/**
 * Server Entry Point
 *
 * Bootstraps the application:
 *  1. Validates environment variables (via env.ts import)
 *  2. Connects to MongoDB
 *  3. Creates an HTTP server and attaches Socket.io
 *  4. Starts listening on the configured PORT
 *  5. Registers graceful shutdown handlers
 */

import http from "http";
import { Server as SocketIOServer } from "socket.io";
import app from "./app";
import { env } from "./config/env";
import { connectDB, disconnectDB } from "./config/db";
import { logger } from "./utils/logger";

// ─── HTTP + Socket.io ────────────────────────────────────────────────────────

const httpServer = http.createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 60000,
});

// Basic Socket.io connection handling
io.on("connection", (socket) => {
  logger.info(`🔌  Socket connected: ${socket.id}`);

  socket.on("join_chat", (chatId) => {
    socket.join(chatId);
    logger.info(`💬  Socket ${socket.id} joined chat room: ${chatId}`);
  });

  socket.on("leave_chat", (chatId) => {
    socket.leave(chatId);
    logger.info(`💬  Socket ${socket.id} left chat room: ${chatId}`);
  });

  socket.on("disconnect", (reason) => {
    logger.info(`🔌  Socket disconnected: ${socket.id} (${reason})`);
  });
});

// Make io accessible to the rest of the app (e.g. controllers that emit events)
app.set("io", io);

// ─── Start Server ────────────────────────────────────────────────────────────

const start = async (): Promise<void> => {
  try {
    // 1. Connect to database
    await connectDB();

    // 2. Start listening
    httpServer.listen(env.PORT, () => {
      logger.info(
        `🚀  Server running on port ${env.PORT} in ${env.NODE_ENV} mode`
      );
      logger.info(`📡  Health check: http://localhost:${env.PORT}/api/health`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

// ─── Graceful Shutdown ───────────────────────────────────────────────────────

const shutdown = async (signal: string): Promise<void> => {
  logger.info(`\n${signal} received – shutting down gracefully...`);

  // Stop accepting new connections
  httpServer.close(async () => {
    logger.info("HTTP server closed");

    // Close Socket.io connections
    io.close(() => {
      logger.info("Socket.io closed");
    });

    // Disconnect from MongoDB
    await disconnectDB();

    logger.info("👋  Shutdown complete");
    process.exit(0);
  });

  // Force shutdown after 10 seconds if graceful shutdown stalls
  setTimeout(() => {
    logger.error("Graceful shutdown timed out – forcing exit");
    process.exit(1);
  }, 10000);
};

// Listen for termination signals
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// Catch unhandled rejections and uncaught exceptions
process.on("unhandledRejection", (reason: Error) => {
  logger.error("Unhandled Rejection:", reason);
  // Let the process terminate so a process manager can restart it
  shutdown("unhandledRejection");
});

process.on("uncaughtException", (error: Error) => {
  logger.error("Uncaught Exception:", error);
  shutdown("uncaughtException");
});

// ─── Go! ─────────────────────────────────────────────────────────────────────
start();

export { io };
