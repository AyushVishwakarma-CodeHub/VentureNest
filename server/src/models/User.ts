/**
 * User Model
 *
 * Core user document stored in MongoDB. Handles:
 *  - Password hashing via bcrypt pre-save hook
 *  - Password comparison method for login
 *  - Custom toJSON to strip sensitive fields
 */

import mongoose, { Schema, CallbackError } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser, UserRole } from "../types";

const SALT_ROUNDS = 12;

const userSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[\w.+-]+@[\w-]+\.[\w.]+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: function (this: IUser) {
        // Password is not required for Google OAuth users
        return !this.googleId;
      },
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // excluded from queries by default
    },
    role: {
      type: String,
      enum: {
        values: Object.values(UserRole),
        message: "Role must be one of: entrepreneur, investor, mentor, admin",
      },
      default: UserRole.ENTREPRENEUR,
    },
    avatar: {
      type: String,
      default: undefined,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // ── Email Verification ──────────────────────────────────────────────
    verificationToken: { type: String, select: false },
    verificationExpiry: { type: Date, select: false },

    // ── Password Reset ──────────────────────────────────────────────────
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpiry: { type: Date, select: false },

    // ── Session / OAuth ─────────────────────────────────────────────────
    refreshToken: { type: String, select: false },
    googleId: { type: String, sparse: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ─────────────────────────────────────────────────────────────────

userSchema.index({ verificationToken: 1 }, { sparse: true });
userSchema.index({ resetPasswordToken: 1 }, { sparse: true });

// ─── Pre-save Hook: Hash Password ────────────────────────────────────────────

userSchema.pre<IUser>("save", async function (next) {
  // Only hash if the password field was modified (or is new)
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

// ─── Instance Methods ────────────────────────────────────────────────────────

/**
 * Compare a plain-text password with the stored hash.
 */
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  // `this.password` may not be loaded because of `select: false`.
  // Callers must explicitly `.select("+password")` when needed.
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Strip sensitive fields when serialising to JSON (e.g. in API responses).
 */
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.verificationToken;
  delete obj.verificationExpiry;
  delete obj.resetPasswordToken;
  delete obj.resetPasswordExpiry;
  delete obj.__v;
  return obj;
};

// ─── Virtual: Full Name ──────────────────────────────────────────────────────

userSchema.virtual("fullName").get(function (this: IUser) {
  return `${this.firstName} ${this.lastName}`;
});

export const User = mongoose.model<IUser>("User", userSchema);
