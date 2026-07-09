/**
 * AI & Matchmaking Controller
 * 
 * Computes sector-based investor matching scores and generates realistic 
 * mock SWOT feedback assessments for startups.
 */

import { Request, Response } from "express";
import { Startup } from "../models/Startup";
import { User } from "../models/User";
import { Profile } from "../models/Profile";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

// ─── INVESTOR MATCHMAKING ───────────────────────────────────────────────────
export const getInvestorMatches = asyncHandler(async (req: Request, res: Response) => {
  const { startupId } = req.params;

  const startup = await Startup.findById(startupId);
  if (!startup) throw ApiError.notFound("Startup not found");

  // Fetch all profiles of type 'investor'
  const investorUsers = await User.find({ role: "investor", isActive: true });
  const investorIds = investorUsers.map(u => u._id);

  // Fetch profiles of these investors to examine interests / sectors
  const investorProfiles = await Profile.find({ user: { $in: investorIds } }).populate("user", "firstName lastName avatar email");

  const matches = investorProfiles.map((prof: any) => {
    // Calculate overlap of startup industry sectors and investor interest sectors
    const investorInterests = prof.interests || [];
    const startupIndustries = startup.industry || [];

    const overlap = startupIndustries.filter(ind => 
      investorInterests.some((int: string) => int.toLowerCase() === ind.toLowerCase())
    );

    // Calculate match percentage base
    let matchScore = 30; // base score
    if (overlap.length > 0) {
      matchScore += Math.min(overlap.length * 20, 60); // up to +60% for sector overlaps
    }

    // Adjust score based on investment stage alignment
    // For example, if investor headline mentions "seed" and startup is seed stage
    const headlineLower = (prof.headline || "").toLowerCase();
    const stageLower = (startup.stage || "").toLowerCase();
    if (headlineLower.includes(stageLower)) {
      matchScore += 10;
    }

    return {
      investor: prof.user,
      matchScore: Math.min(matchScore, 100),
      matchingSectors: overlap,
      headline: prof.headline || "Active Venture Partner",
    };
  })
  .sort((a, b) => b.matchScore - a.matchScore)
  .slice(0, 10); // Return top 10 matches

  res.status(200).json({
    success: true,
    data: matches,
  });
});

// ─── AI SWOT & INVESTMENT READINESS FEEDBACK ─────────────────────────────────
export const getAiFeedback = asyncHandler(async (req: Request, res: Response) => {
  const { startupId } = req.params;

  const startup = await Startup.findById(startupId);
  if (!startup) throw ApiError.notFound("Startup not found");

  const industries = startup.industry || [];
  const primaryIndustry = industries[0] || "Software";
  const stage = startup.stage || "Pre-Seed";
  const valuation = Math.round((startup.fundingGoal || 100000) / 0.1); // Implied valuation

  // Calculate heuristic readiness score
  let readinessScore = 55; // Base line
  
  // Add score based on description length & details
  if (startup.description && startup.description.length > 200) readinessScore += 10;
  
  // Add score if they have raised capital
  if (startup.fundingRaised && startup.fundingRaised > 0) {
    readinessScore += 15;
  }
  
  // Cap checklist limits
  readinessScore = Math.min(readinessScore, 98);

  // Generate realistic sector-specific SWOT
  const strengths = [
    `Strong alignment within the fast-growing ${primaryIndustry} ecosystem.`,
    startup.fundingRaised && startup.fundingRaised > 0 
      ? `Proven market validation with $${startup.fundingRaised.toLocaleString()} in capital raised.`
      : `High capitalization efficiency with an target goal of $${startup.fundingGoal?.toLocaleString()}.`,
    `Defined milestones schedule outline for the ${stage} stage.`
  ];

  const weaknesses = [
    `Early-stage dependency risk with an implied post-money valuation of $${valuation.toLocaleString()}.`,
    readinessScore < 70 
      ? `Lack of public capital raise history might impact valuation negotations.`
      : `Scaling operations might stress current cash flow reserves.`,
    `Niche market positioning requires high customer education costs.`
  ];

  const opportunities = [
    `Expansion into adjacent sub-sectors of ${primaryIndustry}.`,
    `Leveraging virtual matchmaking to secure strategic VC syndicates.`,
    `Potential first-mover advantages in digital pitch syndicates.`
  ];

  const threats = [
    `Emerging competitors in similar early stages could dilute attention.`,
    `Regulatory shifts affecting technology architectures in ${primaryIndustry}.`,
    `Macroeconomic venture capital slowdown affecting follow-on seed rounds.`
  ];

  const feedback = {
    readinessScore,
    swot: {
      strengths,
      weaknesses,
      opportunities,
      threats,
    },
    recommendation: readinessScore >= 75 
      ? "Investment Ready. Recommended to initiate proposals with matched Seed VCs."
      : "Strengthen profile. Complete more milestone roadmap checkpoints before locking term sheets."
  };

  res.status(200).json({
    success: true,
    data: feedback,
  });
});
