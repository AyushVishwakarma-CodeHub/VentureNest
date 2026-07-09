/**
 * Post Routes
 * 
 * Defines endpoints for creating, listing, and liking social feed updates.
 */

import { Router } from "express";
import { createPost, getPosts, likePost } from "../controllers/postController";
import { authenticate } from "../middlewares/auth";

const router = Router();

// Feed fetch is public, but includes like checks if authenticated
router.get("/", (req, res, next) => {
  // Gracefully verify auth header if exists without blocking public fetches
  if (req.headers.authorization || req.cookies?.accessToken) {
    return authenticate(req, res, next);
  }
  next();
}, getPosts);

// Require auth for creation and toggling likes
router.post("/", authenticate, createPost);
router.post("/:postId/like", authenticate, likePost);

export default router;
