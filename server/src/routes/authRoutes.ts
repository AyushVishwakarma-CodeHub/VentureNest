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
} from "../controllers/authController";
import { validate } from "../middlewares/validate";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "../validators/authValidator";
import { authenticate } from "../middlewares/auth";
import { authLimiter } from "../middlewares/rateLimiter";

const router = Router();

// Apply the stricter auth rate limiter to every route in this group
router.use(authLimiter);

// ── Public routes ────────────────────────────────────────────────────────────

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.post("/refresh-token", refreshTokenHandler);
router.post("/verify-email", validate(verifyEmailSchema), verifyEmail);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.post("/google-auth", googleAuth);

// ── Protected routes ─────────────────────────────────────────────────────────

router.get("/me", authenticate, getMe);

export default router;
