import { validationResult } from "express-validator";

/**
 * Middleware that reads express-validator results and short-circuits
 * the request with a 400 if any validation rule failed.
 * Place this AFTER your validation chains in the route definition.
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }

  next();
};

