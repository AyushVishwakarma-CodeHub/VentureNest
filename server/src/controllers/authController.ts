/**
 * Auth Controller
 *
 * Handles every authentication-related action: registration, login, logout,
 * token refresh, email verification, password reset, Google OAuth, and
 * fetching the current user's profile.
 */

import crypto from "crypto";
import { Request, Response } from "express";
import { User } from "../models/User";
import { Profile } from "../models/Profile";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
} from "../utils/email";
import { isProd } from "../config/env";
import { AuthPayload, UserRole } from "../types";
import { logger } from "../utils/logger";

// ─── Cookie Options ──────────────────────────────────────────────────────────

const REFRESH_COOKIE_NAME = "refreshToken";

const refreshCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? ("strict" as const) : ("lax" as const),
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: "/",
};

// ─── Helper: build auth payload from a user document ─────────────────────────

const buildPayload = (user: InstanceType<typeof User>): AuthPayload => ({
  userId: user._id.toString(),
  email: user.email,
  role: user.role as UserRole,
});

// ─── REGISTER ────────────────────────────────────────────────────────────────

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, role } = req.body;

  // Check for existing user
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw ApiError.conflict("An account with this email already exists");
  }

  // Generate email-verification token (random hex, 64 chars)
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 h

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role,
    verificationToken,
    verificationExpiry,
  });

  // Create an empty profile linked to the new user
  await Profile.create({ user: user._id });

  // Send verification email (non-blocking – don't let a mail failure block signup)
  sendVerificationEmail(email, verificationToken).catch((err) =>
    logger.error("Failed to send verification email:", err)
  );

  res.status(201).json({
    success: true,
    message:
      "Registration successful. Please check your email to verify your account.",
    data: { user: user.toJSON() },
  });
});

// ─── LOGIN ───────────────────────────────────────────────────────────────────

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // `.select("+password")` overrides the `select: false` default on the schema
  const user = await User.findOne({ email }).select("+password");

  if (!user || !user.password) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  if (!user.isActive) {
    throw ApiError.forbidden("Your account has been deactivated");
  }

  // Generate token pair
  const payload = buildPayload(user);
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Persist refresh token on the user document so it can be revoked
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // Set refresh token as HTTP-only cookie
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      user: user.toJSON(),
      accessToken,
    },
  });
});

// ─── LOGOUT ──────────────────────────────────────────────────────────────────

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;

  if (refreshToken) {
    // Remove the stored refresh token so it can't be reused
    await User.findOneAndUpdate(
      { refreshToken },
      { $unset: { refreshToken: 1 } }
    );
  }

  res.clearCookie(REFRESH_COOKIE_NAME, refreshCookieOptions);

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

// ─── REFRESH TOKEN ───────────────────────────────────────────────────────────

export const refreshTokenHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const token = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;

    if (!token) {
      throw ApiError.unauthorized("No refresh token provided");
    }

    // Verify the token signature
    const decoded = verifyRefreshToken(token);

    // Ensure the token matches what's stored on the user
    const user = await User.findById(decoded.userId).select("+refreshToken");

    if (!user || user.refreshToken !== token) {
      throw ApiError.unauthorized("Invalid refresh token");
    }

    if (!user.isActive) {
      throw ApiError.forbidden("Your account has been deactivated");
    }

    // Issue a new access token (refresh token stays the same until logout)
    const payload = buildPayload(user);
    const accessToken = generateAccessToken(payload);

    res.status(200).json({
      success: true,
      message: "Token refreshed",
      data: { accessToken },
    });
  }
);

// ─── VERIFY EMAIL ────────────────────────────────────────────────────────────

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;

  const user = await User.findOne({
    verificationToken: token,
    verificationExpiry: { $gt: new Date() },
  }).select("+verificationToken +verificationExpiry");

  if (!user) {
    throw ApiError.badRequest("Invalid or expired verification token");
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationExpiry = undefined;
  await user.save({ validateBeforeSave: false });

  // Fire-and-forget welcome email
  sendWelcomeEmail(user.email, user.firstName).catch((err) =>
    logger.error("Failed to send welcome email:", err)
  );

  res.status(200).json({
    success: true,
    message: "Email verified successfully",
  });
});

// ─── FORGOT PASSWORD ────────────────────────────────────────────────────────

export const forgotPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // Always return a success message to prevent email enumeration
    if (!user) {
      res.status(200).json({
        success: true,
        message:
          "If an account with that email exists, a reset link has been sent",
      });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = resetExpiry;
    await user.save({ validateBeforeSave: false });

    // Send reset email (non-blocking)
    sendPasswordResetEmail(email, resetToken).catch((err) =>
      logger.error("Failed to send password reset email:", err)
    );

    res.status(200).json({
      success: true,
      message:
        "If an account with that email exists, a reset link has been sent",
    });
  }
);

// ─── RESET PASSWORD ─────────────────────────────────────────────────────────

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { token, password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: new Date() },
    }).select("+resetPasswordToken +resetPasswordExpiry");

    if (!user) {
      throw ApiError.badRequest("Invalid or expired reset token");
    }

    user.password = password; // pre-save hook will hash it
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
    // Invalidate any existing refresh tokens to force re-login
    user.refreshToken = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful. Please log in with your new password.",
    });
  }
);

// ─── GOOGLE AUTH ─────────────────────────────────────────────────────────────

export const googleAuth = asyncHandler(async (req: Request, res: Response) => {
  const { googleId, email, firstName, lastName, avatar } = req.body;

  if (!googleId || !email) {
    throw ApiError.badRequest("Google ID and email are required");
  }

  // Look up by googleId first, then by email
  let user = await User.findOne({
    $or: [{ googleId }, { email }],
  });

  if (user) {
    // Link Google account to existing email user if not already linked
    if (!user.googleId) {
      user.googleId = googleId;
      if (avatar && !user.avatar) user.avatar = avatar;
      await user.save({ validateBeforeSave: false });
    }
  } else {
    // Create a new user from Google profile (no password required)
    user = await User.create({
      googleId,
      email,
      firstName: firstName || "Google",
      lastName: lastName || "User",
      avatar,
      isVerified: true, // Google already verified the email
      role: UserRole.ENTREPRENEUR,
    });

    await Profile.create({ user: user._id });
  }

  if (!user.isActive) {
    throw ApiError.forbidden("Your account has been deactivated");
  }

  // Issue tokens
  const payload = buildPayload(user);
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);

  res.status(200).json({
    success: true,
    message: "Google authentication successful",
    data: {
      user: user.toJSON(),
      accessToken,
    },
  });
});

// ─── GET ME ──────────────────────────────────────────────────────────────────

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw ApiError.unauthorized("Authentication required");
  }

  // Load the user's profile alongside the user document
  const profile = await Profile.findOne({ user: req.user._id });

  res.status(200).json({
    success: true,
    message: "User fetched successfully",
    data: {
      user: req.user.toJSON(),
      profile,
    },
  });
});
