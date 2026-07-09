/**
 * Email Utility
 *
 * Wraps Nodemailer to provide high-level email helpers.
 * In development mode emails are logged to the console rather than sent,
 * so SMTP credentials are not required for local work.
 */

import nodemailer from "nodemailer";
import { env, isDev } from "../config/env";
import { logger } from "./logger";

// ─── Transporter ─────────────────────────────────────────────────────────────

let transporter: nodemailer.Transporter | null = null;

if (env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465, // true for 465, false for other ports
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
  logger.info("📧  SMTP transporter initialised");
} else {
  logger.warn(
    "⚠️  SMTP credentials missing – emails will be logged to the console"
  );
}

// ─── Internal Send Helper ────────────────────────────────────────────────────

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

const sendMail = async (options: MailOptions): Promise<void> => {
  // In dev mode or when SMTP is not configured, log instead of sending
  if (isDev || !transporter) {
    logger.info("──────── EMAIL (dev mode) ────────");
    logger.info(`To:      ${options.to}`);
    logger.info(`Subject: ${options.subject}`);
    logger.info(`Body:\n${options.html}`);
    logger.info("──────────────────────────────────");
    return;
  }

  await transporter.sendMail({
    from: `"Startup Pitch Hub" <${env.EMAIL_FROM}>`,
    ...options,
  });
};

// ─── Public Helpers ──────────────────────────────────────────────────────────

/**
 * Send an email-verification link to a newly registered user.
 */
export const sendVerificationEmail = async (
  to: string,
  token: string
): Promise<void> => {
  const verificationUrl = `${env.CLIENT_URL}/verify-email?token=${token}`;

  await sendMail({
    to,
    subject: "Verify your email – Startup Pitch Hub",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to Startup Pitch Hub! 🚀</h2>
        <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
        <a href="${verificationUrl}"
           style="display: inline-block; padding: 12px 24px; background-color: #2563eb;
                  color: #ffffff; text-decoration: none; border-radius: 6px; margin: 16px 0;">
          Verify Email
        </a>
        <p style="color: #6b7280; font-size: 14px;">
          If the button doesn't work, copy and paste this link into your browser:<br/>
          <a href="${verificationUrl}">${verificationUrl}</a>
        </p>
        <p style="color: #6b7280; font-size: 12px;">This link expires in 24 hours.</p>
      </div>
    `,
  });
};

/**
 * Send a password-reset link.
 */
export const sendPasswordResetEmail = async (
  to: string,
  token: string
): Promise<void> => {
  const resetUrl = `${env.CLIENT_URL}/reset-password?token=${token}`;

  await sendMail({
    to,
    subject: "Reset your password – Startup Pitch Hub",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Password Reset Request</h2>
        <p>You requested a password reset. Click the button below to choose a new password:</p>
        <a href="${resetUrl}"
           style="display: inline-block; padding: 12px 24px; background-color: #2563eb;
                  color: #ffffff; text-decoration: none; border-radius: 6px; margin: 16px 0;">
          Reset Password
        </a>
        <p style="color: #6b7280; font-size: 14px;">
          If you didn't request this, you can safely ignore this email.<br/>
          The link expires in 1 hour.
        </p>
      </div>
    `,
  });
};

/**
 * Send a welcome email after the user verifies their account.
 */
export const sendWelcomeEmail = async (
  to: string,
  name: string
): Promise<void> => {
  await sendMail({
    to,
    subject: `Welcome aboard, ${name}! 🎉 – Startup Pitch Hub`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Hey ${name}, you're all set!</h2>
        <p>Your email is verified and your account is ready to go.</p>
        <p>Here's what you can do next:</p>
        <ul>
          <li>Complete your profile</li>
          <li>Explore startup pitches</li>
          <li>Connect with investors and mentors</li>
        </ul>
        <a href="${env.CLIENT_URL}/dashboard"
           style="display: inline-block; padding: 12px 24px; background-color: #2563eb;
                  color: #ffffff; text-decoration: none; border-radius: 6px; margin: 16px 0;">
          Go to Dashboard
        </a>
      </div>
    `,
  });
};
