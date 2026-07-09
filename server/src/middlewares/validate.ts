/**
 * Validation Middleware Factory
 *
 * Accepts a Zod schema and returns Express middleware that validates
 * req.body against it. Validation errors are returned as a structured
 * 400 response listing every invalid field.
 */

import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

/**
 * Creates a middleware that validates `req.body` using the given Zod schema.
 * On success the parsed (and potentially transformed) body replaces `req.body`.
 *
 * @param schema - A Zod schema object
 */
export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // `parse` throws on failure; on success it returns the coerced value
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: formattedErrors,
        });
        return;
      }

      // Non-Zod errors bubble up to the global handler
      next(error);
    }
  };
};
