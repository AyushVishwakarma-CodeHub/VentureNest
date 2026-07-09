/**
 * Review Routes
 * 
 * Defines endpoints for submitting and checking mentor reviews.
 */

import { Router } from "express";
import {
  addReview,
  getMentorReviews,
} from "../controllers/reviewController";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get("/mentor/:mentorId", getMentorReviews);

// Apply auth to review submission
router.post("/", authenticate, addReview);

export default router;
