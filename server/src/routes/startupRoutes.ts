/**
 * Startup Routes
 * 
 * Defines endpoints for startup profiles, including CRUD, filters, and media uploads.
 */

import { Router } from "express";
import {
  createStartup,
  getStartups,
  getStartupBySlug,
  updateStartup,
  deleteStartup,
  uploadLogo,
  uploadPitchDeck,
  uploadVideoDemo,
  addTractionMetric,
  addMilestone,
  getMyStartup,
} from "../controllers/startupController";
import { authenticate } from "../middlewares/auth";
import { validate } from "../middlewares/validate";
import { createStartupSchema, updateStartupSchema, tractionSchema, milestoneSchema } from "../validators/startupValidator";
import { uploadImage, uploadDocument, uploadVideo } from "../middlewares/upload";

const router = Router();

// ─── Public Routes ───────────────────────────────────────────────────────────
router.get("/", getStartups);
router.get("/s/:slug", getStartupBySlug); // Retrieve single startup detail

// ─── Protected Routes ────────────────────────────────────────────────────────
router.get("/my", authenticate, getMyStartup);
router.post("/", authenticate, validate(createStartupSchema), createStartup);
router.put("/:id", authenticate, validate(updateStartupSchema), updateStartup);
router.delete("/:id", authenticate, deleteStartup);

// ─── Media Uploads (Protected) ────────────────────────────────────────────────
router.post("/:id/logo", authenticate, uploadImage.single("logo"), uploadLogo);
router.post("/:id/pitch-deck", authenticate, uploadDocument.single("pitchDeck"), uploadPitchDeck);
router.post("/:id/video", authenticate, uploadVideo.single("videoDemo"), uploadVideoDemo);

// ─── Business Analytics & Roadmap (Protected) ──────────────────────────────────
router.post("/:id/traction", authenticate, validate(tractionSchema), addTractionMetric);
router.post("/:id/milestone", authenticate, validate(milestoneSchema), addMilestone);

export default router;
