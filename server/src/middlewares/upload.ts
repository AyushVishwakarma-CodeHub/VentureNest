/**
 * Multer Upload Middleware
 *
 * Pre-configured Multer instances for different file types.
 * Uses memory storage so buffers can be streamed directly to Cloudinary
 * without touching the local disk.
 */

import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import { ApiError } from "../utils/ApiError";

// ─── Storage ─────────────────────────────────────────────────────────────────

const memoryStorage = multer.memoryStorage();

// ─── File-type Filters ───────────────────────────────────────────────────────

const imageFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(ApiError.badRequest("Only JPEG, PNG, GIF, and WebP images are allowed"));
  }
};

const documentFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const allowed = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      ApiError.badRequest(
        "Only PDF, DOC, DOCX, PPT, and PPTX documents are allowed"
      )
    );
  }
};

const videoFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  const allowed = ["video/mp4", "video/mpeg", "video/quicktime", "video/webm"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(ApiError.badRequest("Only MP4, MPEG, MOV, and WebM videos are allowed"));
  }
};

// ─── Exported Multer Instances ───────────────────────────────────────────────

/** Accept a single image up to 5 MB */
export const uploadImage = multer({
  storage: memoryStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

/** Accept a single document up to 10 MB */
export const uploadDocument = multer({
  storage: memoryStorage,
  fileFilter: documentFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

/** Accept a single video up to 100 MB */
export const uploadVideo = multer({
  storage: memoryStorage,
  fileFilter: videoFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
});
