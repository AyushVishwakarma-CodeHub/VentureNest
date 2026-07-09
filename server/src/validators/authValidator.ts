/**
 * Auth Validators
 *
 * Zod schemas that define the shape and constraints for every
 * authentication-related request body.
 */

import { z } from "zod";
import { UserRole } from "../types";

// ─── Shared field helpers ────────────────────────────────────────────────────

const passwordField = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password cannot exceed 128 characters")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])/,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  );

const emailField = z
  .string()
  .email("Please provide a valid email address")
  .max(255)
  .transform((v) => v.toLowerCase().trim());

// ─── Registration ────────────────────────────────────────────────────────────

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(50, "First name cannot exceed 50 characters")
      .trim(),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(50, "Last name cannot exceed 50 characters")
      .trim(),
    email: emailField,
    password: passwordField,
    confirmPassword: z.string(),
    role: z
      .nativeEnum(UserRole, {
        errorMap: () => ({
          message: "Role must be one of: entrepreneur, investor, mentor",
        }),
      })
      .optional()
      .default(UserRole.ENTREPRENEUR),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  // Prevent self-assigned admin role
  .refine((data) => data.role !== UserRole.ADMIN, {
    message: "Cannot self-assign admin role",
    path: ["role"],
  });

// ─── Login ───────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Password is required"),
});

// ─── Forgot Password ────────────────────────────────────────────────────────

export const forgotPasswordSchema = z.object({
  email: emailField,
});

// ─── Reset Password ─────────────────────────────────────────────────────────

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset token is required"),
    password: passwordField,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ─── Verify Email ────────────────────────────────────────────────────────────

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

// ─── Type Exports ────────────────────────────────────────────────────────────

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
