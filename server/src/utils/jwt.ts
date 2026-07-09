/**
 * JWT Utility Functions
 *
 * Provides helpers to generate and verify both access and refresh tokens.
 * Access tokens are short-lived (default 15 m) and sent in response bodies.
 * Refresh tokens are long-lived (default 7 d) and stored in HTTP-only cookies.
 */

import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { AuthPayload } from "../types";

// ─── Token Generation ────────────────────────────────────────────────────────

/**
 * Generate a short-lived access token.
 * Contains userId, email, and role for authorization checks.
 */
export const generateAccessToken = (payload: AuthPayload): string => {
  const options: SignOptions = {
    expiresIn: env.JWT_ACCESS_EXPIRY as unknown as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, options);
};

/**
 * Generate a long-lived refresh token.
 * Contains only the userId to keep the payload minimal.
 */
export const generateRefreshToken = (payload: AuthPayload): string => {
  const options: SignOptions = {
    expiresIn: env.JWT_REFRESH_EXPIRY as unknown as SignOptions["expiresIn"],
  };
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, options);
};

// ─── Token Verification ─────────────────────────────────────────────────────

/**
 * Verify and decode an access token.
 * Throws if the token is expired, malformed, or signed with a different secret.
 */
export const verifyAccessToken = (token: string): AuthPayload => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as AuthPayload;
};

/**
 * Verify and decode a refresh token.
 * Throws if the token is expired, malformed, or signed with a different secret.
 */
export const verifyRefreshToken = (token: string): AuthPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as AuthPayload;
};
