/**
 * MongoDB Connection Configuration
 *
 * Establishes connection to MongoDB via Mongoose with automatic retry logic.
 * Retries up to 5 times with exponential back-off before giving up.
 */

import mongoose from "mongoose";
import { env } from "./env";
import { logger } from "../utils/logger";

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

/**
 * Connect to MongoDB with retry logic.
 * Each failed attempt waits progressively longer before retrying.
 */
export const connectDB = async (): Promise<void> => {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      const conn = await mongoose.connect(env.MONGODB_URI, {
        // Mongoose 8 uses the new driver defaults; explicit options kept for clarity
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        family: 4,
      });

      logger.info(
        `✅  MongoDB connected: ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`
      );

      // Helpful lifecycle logging
      mongoose.connection.on("disconnected", () => {
        logger.warn("⚠️  MongoDB disconnected");
      });

      mongoose.connection.on("error", (err) => {
        logger.error("❌  MongoDB connection error:", err);
      });

      return; // success – exit the retry loop
    } catch (error) {
      retries++;
      const delay = RETRY_DELAY_MS * retries; // simple linear back-off

      logger.error(
        `❌  MongoDB connection attempt ${retries}/${MAX_RETRIES} failed. ` +
          `Retrying in ${delay / 1000}s...`,
        error
      );

      if (retries >= MAX_RETRIES) {
        logger.error(
          "❌  All MongoDB connection attempts exhausted. Exiting."
        );
        process.exit(1);
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

/**
 * Gracefully close the Mongoose connection.
 * Called during shutdown to avoid dangling connections.
 */
export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info("🔌  MongoDB disconnected gracefully");
  } catch (error) {
    logger.error("Error during MongoDB disconnection:", error);
  }
};
