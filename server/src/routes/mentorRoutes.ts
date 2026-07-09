/**
 * Mentor Routes
 * 
 * Defines endpoints for listing mentors and requesting 1-on-1 sessions.
 */

import { Router } from "express";
import {
  listMentors,
  requestSession,
  getSessions,
  updateSessionStatus,
} from "../controllers/mentorController";
import { authenticate } from "../middlewares/auth";

const router = Router();

// Public route to list active mentors
router.get("/list", listMentors);

// Require auth for session management
router.use(authenticate);

router.post("/sessions", requestSession);
router.get("/sessions", getSessions);
router.put("/sessions/:id/status", updateSessionStatus);

export default router;
