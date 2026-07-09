/**
 * Chat Routes
 * 
 * Defines endpoints for direct messaging rooms (chats).
 */

import { Router } from "express";
import { createChat, getChats } from "../controllers/chatController";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.use(authenticate);

router.post("/", createChat);
router.get("/", getChats);

export default router;
