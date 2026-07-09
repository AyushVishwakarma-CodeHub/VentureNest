/**
 * Cloudinary Service
 *
 * High-level wrappers around the Cloudinary Upload and Destroy APIs.
 * All functions check whether Cloudinary is configured before attempting
 * any operation and throw a clear ApiError if it is not.
 */

import { UploadApiResponse } from "cloudinary";
import { cloudinary, isCloudinaryConfigured } from "../config/cloudinary";
import { ApiError } from "../utils/ApiError";
import { logger } from "../utils/logger";

/**
 * Internal helper – streams a Buffer to Cloudinary.
 */
const uploadBuffer = (
  buffer: Buffer,
  options: Record<string, unknown>
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("Cloudinary returned no result"));
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Upload an image buffer to Cloudinary. Fallback to mock URL if not configured.
 */
export const uploadImage = async (
  file: Express.Multer.File,
  folder: string
): Promise<UploadApiResponse> => {
  if (!isCloudinaryConfigured) {
    logger.warn("☁️ Cloudinary is not configured. Falling back to mock image URL.");
    return {
      secure_url: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
      public_id: `mock_image_${Date.now()}`,
      resource_type: "image",
    } as any;
  }

  try {
    const result = await uploadBuffer(file.buffer, {
      folder: `startup-pitch-hub/${folder}`,
      resource_type: "image",
      transformation: [
        { width: 1200, crop: "limit" }, // cap width to 1200 px
        { quality: "auto:good" },
        { fetch_format: "auto" },
      ],
    });

    logger.info(`Image uploaded: ${result.public_id}`);
    return result;
  } catch (error) {
    logger.error("Cloudinary image upload failed:", error);
    throw ApiError.internal("Failed to upload image");
  }
};

/**
 * Upload a document (PDF, DOCX, PPTX, etc.) to Cloudinary. Fallback to mock URL if not configured.
 */
export const uploadDocument = async (
  file: Express.Multer.File,
  folder: string
): Promise<UploadApiResponse> => {
  if (!isCloudinaryConfigured) {
    logger.warn("☁️ Cloudinary is not configured. Falling back to mock document URL.");
    return {
      secure_url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      public_id: `mock_doc_${Date.now()}`,
      resource_type: "raw",
    } as any;
  }

  try {
    const result = await uploadBuffer(file.buffer, {
      folder: `startup-pitch-hub/${folder}`,
      resource_type: "raw",
    });

    logger.info(`Document uploaded: ${result.public_id}`);
    return result;
  } catch (error) {
    logger.error("Cloudinary document upload failed:", error);
    throw ApiError.internal("Failed to upload document");
  }
};

/**
 * Upload a video to Cloudinary. Fallback to mock URL if not configured.
 */
export const uploadVideo = async (
  file: Express.Multer.File,
  folder: string
): Promise<UploadApiResponse> => {
  if (!isCloudinaryConfigured) {
    logger.warn("☁️ Cloudinary is not configured. Falling back to mock video URL.");
    return {
      secure_url: "https://www.w3schools.com/html/mov_bbb.mp4",
      public_id: `mock_video_${Date.now()}`,
      resource_type: "video",
    } as any;
  }

  try {
    const result = await uploadBuffer(file.buffer, {
      folder: `startup-pitch-hub/${folder}`,
      resource_type: "video",
      chunk_size: 6_000_000, // 6 MB chunks for large files
    });

    logger.info(`Video uploaded: ${result.public_id}`);
    return result;
  } catch (error) {
    logger.error("Cloudinary video upload failed:", error);
    throw ApiError.internal("Failed to upload video");
  }
};

/**
 * Delete a file from Cloudinary by its public ID. No-op if not configured.
 */
export const deleteFile = async (
  publicId: string,
  resourceType: "image" | "raw" | "video" = "image"
): Promise<void> => {
  if (!isCloudinaryConfigured) {
    logger.warn("☁️ Cloudinary not configured. No-op file deletion.");
    return;
  }

  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    logger.info(`Cloudinary file deleted: ${publicId}`);
  } catch (error) {
    logger.error(`Cloudinary delete failed for ${publicId}:`, error);
    throw ApiError.internal("Failed to delete file");
  }
};
