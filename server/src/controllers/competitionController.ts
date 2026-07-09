/**
 * Competition Controller
 * 
 * Handles pitch competitions scheduling, project submissions, and judge voting.
 */

import { Request, Response } from "express";
import { Competition } from "../models/Competition";
import { Submission } from "../models/Submission";
import { Vote } from "../models/Vote";
import { Startup } from "../models/Startup";
import { Notification } from "../models/Notification";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

// ─── CREATE PITCH COMPETITION ────────────────────────────────────────────────
export const createCompetition = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized("Authentication required");
  const { title, description, rules, prizePool, startDate, endDate } = req.body;

  // Only admin or mentors can organize competitions for safety
  if (!["admin", "mentor"].includes(req.user.role)) {
    throw ApiError.forbidden("Only organizers can launch competitions");
  }

  const competition = await Competition.create({
    title,
    description,
    rules,
    prizePool,
    startDate,
    endDate,
    organizer: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: "Pitch competition created successfully",
    data: competition,
  });
});

// ─── LIST ALL COMPETITIONS ───────────────────────────────────────────────────
export const listCompetitions = asyncHandler(async (_req: Request, res: Response) => {
  const competitions = await Competition.find()
    .populate("organizer", "firstName lastName email")
    .sort({ startDate: 1 });

  res.status(200).json({
    success: true,
    data: competitions,
  });
});

// ─── GET COMPETITION DETAILS ─────────────────────────────────────────────────
export const getCompetition = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const competition = await Competition.findById(id).populate("organizer", "firstName lastName email");
  if (!competition) throw ApiError.notFound("Competition not found");

  res.status(200).json({
    success: true,
    data: competition,
  });
});

// ─── SUBMIT STARTUP ENTRY ────────────────────────────────────────────────────
export const submitEntry = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized("Authentication required");
  const { competitionId, startupId, pitchDeckUrl, videoDemoUrl, description } = req.body;

  const competition = await Competition.findById(competitionId);
  if (!competition) throw ApiError.notFound("Competition not found");

  // Verify startup ownership
  const startup = await Startup.findById(startupId);
  if (!startup) throw ApiError.notFound("Startup not found");

  if (String(startup.founder) !== String(req.user._id)) {
    throw ApiError.forbidden("You do not own this startup");
  }

  // Create submission
  const submission = await Submission.create({
    competition: competitionId,
    startup: startupId,
    pitchDeckUrl,
    videoDemoUrl,
    description,
  });

  // Increment participants count on competition
  await Competition.findByIdAndUpdate(competitionId, { $inc: { participantsCount: 1 } });

  // Notify organizer
  await Notification.create({
    user: competition.organizer,
    type: "system",
    title: "New Competition Submission",
    message: `Startup "${startup.name}" submitted an entry to your competition: "${competition.title}"`,
    actionUrl: `/dashboard/competitions/${competitionId}`,
  });

  res.status(251).json({
    success: true,
    message: "Competition submission uploaded successfully",
    data: submission,
  });
});

// ─── GET SUBMISSIONS FOR COMPETITION ─────────────────────────────────────────
export const getSubmissions = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const submissions = await Submission.find({ competition: id })
    .populate("startup", "name slug logo tagline industry")
    .sort({ score: -1 });

  res.status(200).json({
    success: true,
    data: submissions,
  });
});

// ─── VOTE / SCORE SUBMISSION ─────────────────────────────────────────────────
export const voteSubmission = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw ApiError.unauthorized("Authentication required");
  const judgeId = req.user._id;
  const { submissionId } = req.params;
  const { score, comment } = req.body; // 1 to 10 rating

  if (!score || score < 1 || score > 10) {
    throw ApiError.badRequest("Score rating must be an integer between 1 and 10");
  }

  const submission = await Submission.findById(submissionId).populate("startup");
  if (!submission) throw ApiError.notFound("Submission not found");

  // Check if already voted
  const existingVote = await Vote.findOne({ submission: submissionId, judge: judgeId });
  if (existingVote) {
    throw ApiError.badRequest("You have already voted on this submission");
  }

  // Record vote
  await Vote.create({
    submission: submissionId,
    judge: judgeId,
    score,
    comment,
  });

  // Recalculate average score for this submission
  const votes = await Vote.find({ submission: submissionId });
  const totalScore = votes.reduce((sum, v) => sum + v.score, 0);
  const averageScore = Math.round((totalScore / votes.length) * 10) / 10;

  submission.score = averageScore;
  await submission.save();

  // Notify startup founder of judging vote
  const startup = submission.startup as any;
  await Notification.create({
    user: startup.founder,
    type: "review",
    title: "Project Judged!",
    message: `A judge has voted on your submission to the competition. Score: ${score}/10`,
    actionUrl: `/dashboard/competitions/${submission.competition}`,
  });

  res.status(200).json({
    success: true,
    message: "Vote recorded successfully",
    data: { score: averageScore },
  });
});
