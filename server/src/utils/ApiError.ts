/**
 * Custom API Error Class
 *
 * Extends the native Error to carry HTTP status codes and an
 * `isOperational` flag so the global error handler can distinguish
 * expected client errors from unexpected server crashes.
 */

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    isOperational = true,
    stack?: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Preserve the correct prototype chain
    Object.setPrototypeOf(this, new.target.prototype);

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // ── Static Factory Methods ─────────────────────────────────────────────

  /** 400 – The request body or params are invalid */
  static badRequest(message = "Bad request"): ApiError {
    return new ApiError(400, message);
  }

  /** 401 – Missing or invalid authentication credentials */
  static unauthorized(message = "Unauthorized"): ApiError {
    return new ApiError(401, message);
  }

  /** 403 – Authenticated but lacking the required permissions */
  static forbidden(message = "Forbidden"): ApiError {
    return new ApiError(403, message);
  }

  /** 404 – The requested resource does not exist */
  static notFound(message = "Resource not found"): ApiError {
    return new ApiError(404, message);
  }

  /** 409 – A conflicting resource already exists (e.g. duplicate email) */
  static conflict(message = "Conflict"): ApiError {
    return new ApiError(409, message);
  }

  /** 422 – The request is well-formed but semantically invalid */
  static unprocessable(message = "Unprocessable entity"): ApiError {
    return new ApiError(422, message);
  }

  /** 429 – Rate limit exceeded */
  static tooManyRequests(message = "Too many requests"): ApiError {
    return new ApiError(429, message);
  }

  /** 500 – Unexpected server error (isOperational = false) */
  static internal(message = "Internal server error"): ApiError {
    return new ApiError(500, message, false);
  }
}
