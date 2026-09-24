import express from "express";
import { body } from "express-validator";
import { protect } from "../../middleware/protect.js";
import { authorize } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { createProject, deleteProject, getAllProjects, getMyProjects, getProject, getProjectDetails, updateProject } from "../../controller/project-controller/core.controller.js";

const projectCoreRoutes = express.Router();

projectCoreRoutes.post(
  "/",
  protect,
  body("name").trim().notEmpty().withMessage("Project name is required").isLength({ min: 2, max: 50 }).withMessage("Project name must be between 2 and 50 characters"),
  validate,
  createProject,
);

projectCoreRoutes.get("/:roomId/details", protect, getProjectDetails);
projectCoreRoutes.get("/my-project", protect, getMyProjects);
projectCoreRoutes.get("/", protect, getAllProjects);
projectCoreRoutes.get("/:roomId", protect, getProject);

projectCoreRoutes.patch(
  "/:roomId",
  protect,
  authorize(["owner", "co-leader"]),
  body("name").optional().trim().isLength({ min: 2, max: 50 }).withMessage("Project name must be between 2 and 50 characters"),
  body("isPublic").optional().isBoolean().withMessage("isPublic must be a boolean"),
  validate,
  updateProject,
);

projectCoreRoutes.delete("/:roomId", protect, authorize(["owner", "co-leader"]), deleteProject);

export default projectCoreRoutes;
