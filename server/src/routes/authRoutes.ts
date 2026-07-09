/**
 * Auth Routes
 *
 * All authentication-related endpoints.
 * Validation middleware is applied before each handler to ensure
 * request bodies conform to their Zod schemas.
 */

import { Router } from "express";
import {
  register,
  login,
  logout,
  refreshTokenHandler,
  verifyEmail,
  forgotPassword,
  resetPassword,
  googleAuth,
  getMe,
  getAllUsers,
  toggleUserStatus,
} from "../controllers/authController";
import { validate } from "../middlewares/validate";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "../validators/authValidator";
import { authenticate, authorize } from "../middlewares/auth";
import { authLimiter } from "../middlewares/rateLimiter";
import { UserRole } from "../types";

const router = Router();

// Apply the stricter auth rate limiter to every route in this group
router.use(authLimiter);

// ─── Public routes ────────────────────────────────────────────────────────────

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.post("/refresh-token", refreshTokenHandler);
router.post("/verify-email", validate(verifyEmailSchema), verifyEmail);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.post("/google-auth", googleAuth);

// ─── Protected routes ─────────────────────────────────────────────────────────

router.get("/me", authenticate, getMe);

// ─── Admin routes ────────────────────────────────────────────────────────────

router.get("/users", authenticate, authorize(UserRole.ADMIN), getAllUsers);
router.patch("/users/:userId/status", authenticate, authorize(UserRole.ADMIN), toggleUserStatus);

export default router;
