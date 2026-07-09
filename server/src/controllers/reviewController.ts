/**
 * Review Controller
 * 
 * Handles adding and listing rating feedback for mentors.
 */

import { Request, Response } from "express";
import { Review } from "../models/Review";
import { User } from "../models/User";
import { Notification } from "../models/Notification";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

// ─── ADD MENTOR REVIEW ───────────────────────────────────────────────────────
export const addReview = asyncHandler(async (req: Request, res: Response) => {
  const reviewerId = req.user?._id;
  const { mentorId, rating, comment } = req.body;

  if (!reviewerId) throw ApiError.unauthorized("Authentication required");

  const mentor = await User.findById(mentorId);
  if (!mentor || mentor.role !== "mentor") {
    throw ApiError.badRequest("Selected user is not a registered mentor");
  }

  // Double check if review already exists
  const existingReview = await Review.findOne({ reviewer: reviewerId, reviewee: mentorId });
  if (existingReview) {
    throw ApiError.badRequest("You have already reviewed this mentor");
  }

  const review = await Review.create({
    reviewer: reviewerId,
    reviewee: mentorId,
    rating,
    comment,
  });

  // Notify mentor
  await Notification.create({
    user: mentorId,
    type: "review",
    title: "New Review Left",
    message: `An entrepreneur left you a ${rating}★ review feedback.`,
    actionUrl: `/dashboard/mentor/reviews`,
  });

  res.status(251).json({
    success: true,
    message: "Mentor review submitted successfully",
    data: review,
  });
});

// ─── GET REVIEWS FOR A SPECIFIC MENTOR ────────────────────────────────────────
export const getMentorReviews = asyncHandler(async (req: Request, res: Response) => {
  const { mentorId } = req.params;

  const reviews = await Review.find({ reviewee: mentorId })
    .populate("reviewer", "firstName lastName email avatar")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: reviews,
  });
});
