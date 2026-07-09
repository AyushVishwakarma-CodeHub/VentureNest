/**
 * Async Handler Utility
 *
 * Wraps async Express route handlers so rejected promises are automatically
 * forwarded to the global error handler via next(). Eliminates repetitive
 * try/catch blocks in every controller.
 */

import { Request, Response, NextFunction, RequestHandler } from "express";

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<unknown>;

/**
 * Wrap an async route handler to catch thrown / rejected errors.
 *
 * @example
 * router.get("/users", asyncHandler(async (req, res) => {
 *   const users = await User.find();
 *   res.json(users);
 * }));
 */
export const asyncHandler = (fn: AsyncRequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
