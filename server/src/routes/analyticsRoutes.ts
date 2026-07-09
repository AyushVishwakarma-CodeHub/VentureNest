/**
 * Analytics Routes
 * 
 * Defines endpoints for retrieving dashboard and chart analytics data.
 */

import { Router } from "express";
import {
  getEntrepreneurAnalytics,
  getInvestorAnalytics,
  getMentorAnalytics,
} from "../controllers/analyticsController";
import { authenticate } from "../middlewares/auth";

const router = Router();

// Require authentication for all analytics endpoints
router.use(authenticate);

router.get("/entrepreneur", getEntrepreneurAnalytics);
router.get("/investor", getInvestorAnalytics);
router.get("/mentor", getMentorAnalytics);

export default router;
