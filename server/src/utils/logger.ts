/**
 * Winston Logger
 *
 * Structured logging with different transports and levels per environment:
 *  - Development: colorized console output at "debug" level
 *  - Production:  JSON file output at "info" level + error-only file
 */

import winston from "winston";
import path from "path";

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

// Resolve log directory relative to project root (one level above src/)
const LOG_DIR = path.resolve(__dirname, "../../logs");

// ─── Custom Console Format ───────────────────────────────────────────────────

const consoleFormat = printf(({ level, message, timestamp: ts, stack }) => {
  const text = stack || message;
  return `${ts} [${level}]: ${text}`;
});

// ─── Create Logger ───────────────────────────────────────────────────────────

const isProduction = process.env.NODE_ENV === "production";

export const logger = winston.createLogger({
  level: isProduction ? "info" : "debug",
  defaultMeta: { service: "startup-pitch-hub" },
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }) // capture stack traces
  ),
  transports: [
    // Always log to the console
    new winston.transports.Console({
      format: combine(colorize(), consoleFormat),
    }),
  ],
});

// In production, persist logs to files
if (isProduction) {
  // Combined log – all levels at "info" and above
  logger.add(
    new winston.transports.File({
      filename: path.join(LOG_DIR, "combined.log"),
      format: json(),
      maxsize: 5_242_880, // 5 MB
      maxFiles: 5,
    })
  );

  // Error-only log
  logger.add(
    new winston.transports.File({
      filename: path.join(LOG_DIR, "error.log"),
      level: "error",
      format: json(),
      maxsize: 5_242_880,
      maxFiles: 5,
    })
  );
}

/**
 * Morgan stream adapter – lets Morgan pipe HTTP request logs through Winston.
 */
export const morganStream = {
  write: (message: string): void => {
    logger.http(message.trim());
  },
};
