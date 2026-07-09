/**
 * Message Routes
 * 
 * Defines endpoints for direct messages history and dispatching.
 */

import { Router } from "express";
import { sendMessage, getMessages } from "../controllers/messageController";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.use(authenticate);

router.post("/", sendMessage);
router.get("/:chatId", getMessages);

export default router;
