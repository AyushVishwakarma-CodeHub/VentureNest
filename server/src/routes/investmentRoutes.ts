/**
 * Investment Routes
 * 
 * Defines endpoints for submitting and managing investment proposals.
 */

import { Router } from "express";
import {
  createProposal,
  getProposals,
  updateProposalStatus,
} from "../controllers/investmentController";
import { authenticate } from "../middlewares/auth";

const router = Router();

// Apply auth to all investment routes
router.use(authenticate);

router.post("/", createProposal);
router.get("/", getProposals);
router.put("/:id/status", updateProposalStatus);

export default router;
