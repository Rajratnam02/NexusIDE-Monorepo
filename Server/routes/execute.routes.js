import express from "express";
import { body } from "express-validator";
import { protect } from "../middleware/protect.js";
import { validate } from "../middleware/validate.js";
import { executeCode } from "../controller/execute.controller.js";

const executeRoutes = express.Router();

executeRoutes.post(
  "/",
  protect,
  body("language").trim().notEmpty().withMessage("Language is required"),
  body("code")
    .notEmpty().withMessage("Code cannot be empty")
    .isString().withMessage("Code must be a string")
    .isLength({ max: 50000 }).withMessage("Code cannot exceed 50,000 characters"),
  validate,
  executeCode,
);

export default executeRoutes;
