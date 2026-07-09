/**
 * Authentication & Authorization Middleware
 *
 * - `authenticate`: Extracts and verifies a JWT from the Authorization header
 *   or `accessToken` cookie, then attaches the full user document to `req.user`.
 * - `authorize`: Restricts access to users whose role is in the allowed list.
 */

import { Request, Response, NextFunction } from "express";
import { User } from "../models/User";
import { verifyAccessToken } from "../utils/jwt";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { UserRole } from "../types";

// ─── Authenticate ────────────────────────────────────────────────────────────

/**
 * Middleware: verify the caller's JWT and load their User document.
 * Accepts tokens from:
 *  1. `Authorization: Bearer <token>` header
 *  2. `accessToken` cookie (useful for SSR / browser clients)
 */
export const authenticate = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    let token: string | undefined;

    // 1. Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2. Fall back to cookie
    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken as string;
    }

    if (!token) {
      throw ApiError.unauthorized("Authentication required – no token provided");
    }

    // Verify and decode the token
    const decoded = verifyAccessToken(token);

    // Load the user (excluding the password but including isActive for checks)
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw ApiError.unauthorized("User belonging to this token no longer exists");
    }

    if (!user.isActive) {
      throw ApiError.forbidden("Your account has been deactivated");
    }

    // Attach user to the request for downstream handlers
    req.user = user;
    next();
  }
);

// ─── Authorize ───────────────────────────────────────────────────────────────

/**
 * Middleware factory: restricts the route to users with one of the given roles.
 * Must be used **after** `authenticate`.
 *
 * @example
 * router.delete("/users/:id", authenticate, authorize(UserRole.ADMIN), deleteUser);
 */
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw ApiError.unauthorized("Authentication required");
    }

    if (!roles.includes(req.user.role as UserRole)) {
      throw ApiError.forbidden(
        `Role '${req.user.role}' is not authorised to access this resource`
      );
    }

    next();
  };
};
