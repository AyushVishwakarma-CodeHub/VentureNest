/**
 * Comment Routes
 * 
 * Defines endpoints for comments management.
 */

import { Router } from "express";
import { addComment, getComments } from "../controllers/commentController";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get("/post/:postId", getComments);

// Require auth to comment
router.post("/", authenticate, addComment);

export default router;
