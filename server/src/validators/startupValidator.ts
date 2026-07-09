/**
 * Startup Validators
 * 
 * Zod schemas that define the shape and validation constraints for 
 * startup-related requests (creation, updates, traction metrics, milestones).
 */

import { z } from "zod";
import { StartupStage } from "../types";

// Social links helper schema
const socialLinksSchema = z.object({
  linkedin: z.string().url("Please provide a valid LinkedIn URL").optional().or(z.literal("")),
  twitter: z.string().url("Please provide a valid Twitter URL").optional().or(z.literal("")),
  github: z.string().url("Please provide a valid GitHub URL").optional().or(z.literal("")),
  facebook: z.string().url("Please provide a valid Facebook URL").optional().or(z.literal("")),
}).optional();

// Traction validation schema
export const tractionSchema = z.object({
  metricName: z.string().min(1, "Metric name is required").max(100),
  metricValue: z.string().min(1, "Metric value is required").max(100),
  date: z.string().datetime({ message: "Invalid ISO datetime" }).transform((v) => new Date(v)),
});

// Milestone validation schema
export const milestoneSchema = z.object({
  title: z.string().min(1, "Milestone title is required").max(150),
  description: z.string().max(500).optional(),
  date: z.string().datetime({ message: "Invalid ISO datetime" }).transform((v) => new Date(v)),
  completed: z.boolean().optional().default(false),
});

// Create Startup schema
export const createStartupSchema = z.object({
  name: z.string().min(2, "Startup name must be at least 2 characters").max(100, "Startup name cannot exceed 100 characters").trim(),
  headline: z.string().min(10, "Headline must be at least 10 characters").max(150, "Headline cannot exceed 150 characters").trim(),
  description: z.string().min(50, "Detailed description must be at least 50 characters").trim(),
  industry: z.array(z.string().min(1, "Industry tag cannot be empty")).min(1, "At least one industry is required"),
  stage: z.nativeEnum(StartupStage, {
    errorMap: () => ({ message: "Invalid startup stage" }),
  }),
  location: z.string().min(2, "Location must be at least 2 characters").trim(),
  website: z.string().url("Please provide a valid URL").optional().or(z.literal("")),
  teamSize: z.number().int().min(1, "Team size must be at least 1"),
  launchDate: z.string().datetime({ message: "Invalid ISO datetime" }).optional().transform((v) => v ? new Date(v) : undefined),
  fundingGoal: z.number().min(0, "Funding goal cannot be negative").optional().default(0),
  equityOffered: z.number().min(0).max(100, "Equity cannot exceed 100%").optional(),
  valuation: z.number().min(0, "Valuation cannot be negative").optional(),
  minInvestment: z.number().min(0, "Minimum investment cannot be negative").optional(),
  revenueModel: z.string().max(200).optional(),
  monthlyRecurringRevenue: z.number().min(0).optional(),
  socials: socialLinksSchema,
  cofounders: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid cofounder User ID")).optional(),
});

// Update Startup schema (everything is optional)
export const updateStartupSchema = createStartupSchema.partial().omit({
  name: true, // Cannot change startup name easily due to slug constraints
});

// Type exports
export type CreateStartupInput = z.infer<typeof createStartupSchema>;
export type UpdateStartupInput = z.infer<typeof updateStartupSchema>;
export type TractionInput = z.infer<typeof tractionSchema>;
export type MilestoneInput = z.infer<typeof milestoneSchema>;
