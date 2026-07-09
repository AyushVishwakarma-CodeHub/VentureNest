/**
 * Social Routes
 * 
 * Defines endpoints for bookmarking and following startups or users.
 */

import { Router } from "express";
import {
  bookmarkStartup,
  unbookmarkStartup,
  getBookmarkedStartups,
  followStartup,
  unfollowStartup,
  followUser,
  unfollowUser,
} from "../controllers/socialController";
import { authenticate } from "../middlewares/auth";

const router = Router();

// Require authentication for all social actions
router.use(authenticate);

// Bookmarks
router.get("/bookmarks", getBookmarkedStartups);
router.post("/bookmarks/:startupId", bookmarkStartup);
router.delete("/bookmarks/:startupId", unbookmarkStartup);

// Follows
router.post("/follows/startup/:startupId", followStartup);
router.delete("/follows/startup/:startupId", unfollowStartup);
router.post("/follows/user/:targetUserId", followUser);
router.delete("/follows/user/:targetUserId", unfollowUser);

export default router;
