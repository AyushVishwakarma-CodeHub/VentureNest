/**
 * Analytics Controller
 * 
 * Aggregates database statistics and provides custom datasets tailored for
 * Recharts display in the entrepreneur, investor, and mentor dashboards.
 */

import { Request, Response } from "express";
import { Startup } from "../models/Startup";
import { Bookmark } from "../models/Bookmark";
import { Follow } from "../models/Follow";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

// ─── ENTREPRENEUR ANALYTICS ──────────────────────────────────────────────────
export const getEntrepreneurAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  if (!userId) throw ApiError.unauthorized("Authentication required");

  // Find the founder's startup
  const startup = await Startup.findOne({ founder: userId });
  if (!startup) {
    // If no startup profile created yet, return empty but descriptive state
    return res.status(200).json({
      success: true,
      data: {
        hasStartup: false,
        stats: { views: 0, followers: 0, bookmarks: 0, fundingProgress: 0 },
        viewsOverTime: [],
        milestonesSummary: { completed: 0, pending: 0 },
      },
    });
  }

  // Completed vs Pending milestones
  const completedMilestones = startup.milestones.filter(m => m.completed).length;
  const pendingMilestones = startup.milestones.length - completedMilestones;

  // Generate mock-realistic views over time for area chart display
  // In a full tracking implementation, this logs HTTP hits.
  const viewsOverTime = [
    { name: "Jan", views: Math.round(startup.views * 0.05) },
    { name: "Feb", views: Math.round(startup.views * 0.1) },
    { name: "Mar", views: Math.round(startup.views * 0.15) },
    { name: "Apr", views: Math.round(startup.views * 0.25) },
    { name: "May", views: Math.round(startup.views * 0.4) },
    { name: "Jun", views: Math.round(startup.views * 0.7) },
    { name: "Jul", views: startup.views },
  ];

  // Industry benchmark comparisons (Mocked for dashboard styling)
  const industryBenchmarks = [
    { subject: "Team Size", startupValue: startup.teamSize, averageValue: 8 },
    { subject: "Views", startupValue: startup.views, averageValue: 120 },
    { subject: "Followers", startupValue: startup.followersCount, averageValue: 35 },
    { subject: "Funding Goal", startupValue: Math.round(startup.fundingGoal / 10000), averageValue: 50 },
    { subject: "Traction Metrics", startupValue: startup.traction.length * 2, averageValue: 5 },
  ];

  return res.status(200).json({
    success: true,
    data: {
      hasStartup: true,
      startupName: startup.name,
      slug: startup.slug,
      stats: {
        views: startup.views,
        followers: startup.followersCount,
        bookmarks: startup.bookmarksCount,
        fundingRaised: startup.fundingRaised,
        fundingGoal: startup.fundingGoal,
        fundingProgress: startup.fundingGoal > 0 
          ? Math.round((startup.fundingRaised / startup.fundingGoal) * 100) 
          : 0,
      },
      viewsOverTime,
      industryBenchmarks,
      milestonesSummary: {
        completed: completedMilestones,
        pending: pendingMilestones,
      },
    },
  });
});

// ─── INVESTOR ANALYTICS ──────────────────────────────────────────────────────
export const getInvestorAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  if (!userId) throw ApiError.unauthorized("Authentication required");

  // Bookmarks and Follows count
  const bookmarksCount = await Bookmark.countDocuments({ user: userId });
  const followsCount = await Follow.countDocuments({ follower: userId, followingType: "startup" });

  // Get bookmarked startups to aggregate industry and stage distributions
  const bookmarks = await Bookmark.find({ user: userId }).populate("startup");
  const bookmarkedStartups = bookmarks.map(b => b.startup).filter(s => s !== null) as any[];

  // Industry distribution for Pie Chart
  const industryMap: Record<string, number> = {};
  // Stage distribution for Bar Chart
  const stageMap: Record<string, number> = {};

  bookmarkedStartups.forEach(s => {
    // Industries (could be multiple per startup)
    s.industry?.forEach((ind: string) => {
      industryMap[ind] = (industryMap[ind] || 0) + 1;
    });
    // Stage
    stageMap[s.stage] = (stageMap[s.stage] || 0) + 1;
  });

  const industryData = Object.keys(industryMap).map(name => ({
    name,
    value: industryMap[name],
  }));

  const stageData = Object.keys(stageMap).map(name => ({
    name,
    value: stageMap[name],
  }));

  // Mock investor portfolio dashboard data for display (Phase 4 will link real transactions)
  const portfolioStats = {
    totalInvested: 150000,
    activeProposals: 3,
    meetingsScheduled: 2,
    portfolioCompanies: bookmarkedStartups.slice(0, 3).map(s => ({
      name: s.name,
      stage: s.stage,
      investedAmount: 50000,
      equityOwned: 5,
    })),
  };

  res.status(200).json({
    success: true,
    data: {
      stats: {
        bookmarksCount,
        followsCount,
        totalInvested: portfolioStats.totalInvested,
        activeProposals: portfolioStats.activeProposals,
        meetingsScheduled: portfolioStats.meetingsScheduled,
      },
      industryDistribution: industryData.length > 0 ? industryData : [
        { name: "SaaS", value: 4 },
        { name: "Fintech", value: 2 },
        { name: "AI/ML", value: 3 },
        { name: "Healthtech", value: 1 },
      ],
      stageDistribution: stageData.length > 0 ? stageData : [
        { name: "Idea", value: 1 },
        { name: "MVP", value: 2 },
        { name: "Seed", value: 4 },
        { name: "Series A", value: 2 },
      ],
      portfolioCompanies: portfolioStats.portfolioCompanies,
    },
  });
});

// ─── MENTOR ANALYTICS ────────────────────────────────────────────────────────
export const getMentorAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  if (!userId) throw ApiError.unauthorized("Authentication required");

  // Mock details for Mentor dashboard
  const mentorStats = {
    averageRating: 4.8,
    totalReviews: 12,
    completedSessions: 8,
    upcomingSessions: 2,
    ratingDistribution: [
      { star: "5 ★", count: 9 },
      { star: "4 ★", count: 2 },
      { star: "3 ★", count: 1 },
      { star: "2 ★", count: 0 },
      { star: "1 ★", count: 0 },
    ],
    growthData: [
      { name: "Mar", sessions: 1 },
      { name: "Apr", sessions: 2 },
      { name: "May", sessions: 2 },
      { name: "Jun", sessions: 3 },
      { name: "Jul", sessions: 8 },
    ],
  };

  res.status(200).json({
    success: true,
    data: mentorStats,
  });
});
