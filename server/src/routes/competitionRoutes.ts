/**
 * Competition Routes
 * 
 * Defines endpoints for pitch competitions, submissions, and judge scoring.
 */

import { Router } from "express";
import {
  createCompetition,
  listCompetitions,
  getCompetition,
  submitEntry,
  getSubmissions,
  voteSubmission,
} from "../controllers/competitionController";
import { authenticate } from "../middlewares/auth";

const router = Router();

// Public routes
router.get("/list", listCompetitions);
router.get("/:id", getCompetition);
router.get("/:id/submissions", getSubmissions);

// Protected routes (require login)
router.post("/", authenticate, createCompetition);
router.post("/submit", authenticate, submitEntry);
router.post("/submissions/:submissionId/vote", authenticate, voteSubmission);

export default router;
