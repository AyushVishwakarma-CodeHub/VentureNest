/**
 * AI Routes
 * 
 * Defines endpoints for investor matching recommendations and AI SWOT feedback.
 */

import { Router } from "express";
import { getInvestorMatches, getAiFeedback } from "../controllers/aiController";
import { authenticate } from "../middlewares/auth";

const router = Router();

// Apply auth to all AI routes
router.use(authenticate);

router.get("/startup/:startupId/matches", getInvestorMatches);
router.get("/startup/:startupId/feedback", getAiFeedback);

export default router;
