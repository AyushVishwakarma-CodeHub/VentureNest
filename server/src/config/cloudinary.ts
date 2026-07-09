/**
 * Cloudinary Configuration
 *
 * Initialises the Cloudinary SDK with credentials from the environment.
 * If credentials are missing the app still starts, but upload calls will
 * return a clear error instead of crashing.
 */

import { v2 as cloudinary } from "cloudinary";
import { env } from "./env";
import { logger } from "../utils/logger";

/** Whether Cloudinary is properly configured with all required credentials */
let isConfigured = false;

if (
  env.CLOUDINARY_CLOUD_NAME &&
  env.CLOUDINARY_API_KEY &&
  env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  isConfigured = true;
  logger.info("☁️  Cloudinary configured successfully");
} else {
  logger.warn(
    "⚠️  Cloudinary credentials missing – file uploads will be disabled. " +
      "Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
  );
}

export { cloudinary, isConfigured as isCloudinaryConfigured };
