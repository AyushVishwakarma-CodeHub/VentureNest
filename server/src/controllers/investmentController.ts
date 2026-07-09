/**
 * Investment Controller
 * 
 * Handles investment proposals, status negotiations, and updating startup funded pools.
 */

import { Request, Response } from "express";
import { Investment } from "../models/Investment";
import { Startup } from "../models/Startup";
import { Notification } from "../models/Notification";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

// ─── SUBMIT INVESTMENT PROPOSAL ──────────────────────────────────────────────
export const createProposal = asyncHandler(async (req: Request, res: Response) => {
  const investorId = req.user?._id;
  const { startupId, amount, equityOffered, message } = req.body;

  if (req.user?.role !== "investor") {
    throw ApiError.forbidden("Only investors can submit investment proposals");
  }

  const startup = await Startup.findById(startupId);
  if (!startup) throw ApiError.notFound("Startup not found");

  const investment = await Investment.create({
    investor: investorId,
    startup: startupId,
    amount,
    equityOffered,
    message,
    timeline: [{ status: "pending", comment: "Proposal submitted by investor" }],
  });

  // Notify founder
  await Notification.create({
    user: startup.founder,
    type: "investment",
    title: "New Investment Proposal",
    message: `${req.user.firstName} ${req.user.lastName} submitted a proposal for ${amount} at ${equityOffered}% equity`,
    actionUrl: `/dashboard/investments`,
  });

  res.status(251).json({
    success: true,
    message: "Investment proposal submitted successfully",
    data: investment,
  });
});

// ─── GET USER PROPOSALS ──────────────────────────────────────────────────────
export const getProposals = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const role = req.user?.role;
  if (!userId) throw ApiError.unauthorized("Authentication required");

  let query = {};
  if (role === "investor") {
    query = { investor: userId };
  } else if (role === "entrepreneur") {
    // Find startups owned by this entrepreneur
    const myStartups = await Startup.find({ founder: userId }).select("_id");
    const startupIds = myStartups.map(s => s._id);
    query = { startup: { $in: startupIds } };
  } else {
    throw ApiError.forbidden("Access denied");
  }

  const proposals = await Investment.find(query)
    .populate("investor", "firstName lastName email avatar")
    .populate("startup", "name slug logo industry")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: proposals,
  });
});

// ─── UPDATE PROPOSAL STATUS ──────────────────────────────────────────────────
export const updateProposalStatus = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { id } = req.params;
  const { status, comment } = req.body; // accepted, rejected, withdrawn

  if (!["accepted", "rejected", "withdrawn"].includes(status)) {
    throw ApiError.badRequest("Invalid proposal status");
  }

  const proposal = await Investment.findById(id).populate("startup");
  if (!proposal) throw ApiError.notFound("Proposal not found");

  const startup = proposal.startup as any;

  // Role permissions checks
  if (status === "withdrawn" && String(proposal.investor) !== String(userId)) {
    throw ApiError.forbidden("Only the proposing investor can withdraw this proposal");
  }

  if (["accepted", "rejected"].includes(status) && String(startup.founder) !== String(userId)) {
    throw ApiError.forbidden("Only the startup founder can accept/reject this proposal");
  }

  proposal.status = status;
  proposal.timeline.push({ status, comment, date: new Date() });
  await proposal.save();

  // If accepted, add to startup raised totals
  if (status === "accepted") {
    await Startup.findByIdAndUpdate(startup._id, {
      $inc: { fundingRaised: proposal.amount },
    });
  }

  // Notify investor / founder of decision
  const recipientId = status === "withdrawn" ? startup.founder : proposal.investor;
  const title = `Investment Proposal ${status.toUpperCase()}`;
  const message = status === "withdrawn"
    ? `Investor withdrew their proposal for ${startup.name}`
    : `Founder of ${startup.name} has ${status} your investment proposal`;

  await Notification.create({
    user: recipientId,
    type: "investment",
    title,
    message,
    actionUrl: `/dashboard/investments`,
  });

  res.status(200).json({
    success: true,
    message: `Proposal ${status} successfully`,
    data: proposal,
  });
});
