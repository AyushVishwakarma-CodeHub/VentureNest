/**
 * Meeting Routes
 * 
 * Defines endpoints for booking and checking scheduled meeting syncs.
 */

import { Router } from "express";
import {
  scheduleMeeting,
  getMeetings,
  updateMeetingStatus,
} from "../controllers/meetingController";
import { authenticate } from "../middlewares/auth";

const router = Router();

// Apply auth to all meeting routes
router.use(authenticate);

router.post("/", scheduleMeeting);
router.get("/", getMeetings);
router.put("/:id/status", updateMeetingStatus);

export default router;
