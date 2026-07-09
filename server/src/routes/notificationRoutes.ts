/**
 * Notification Routes
 * 
 * Defines endpoints for tracking and managing user notifications.
 */

import { Router } from "express";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notificationController";
import { authenticate } from "../middlewares/auth";

const router = Router();

// Apply auth to all notification routes
router.use(authenticate);

router.get("/", getNotifications);
router.put("/read-all", markAllAsRead);
router.put("/:id/read", markAsRead);
router.delete("/:id", deleteNotification);

export default router;
