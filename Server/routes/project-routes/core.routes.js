import express from "express";
import { protect } from "../../middleware/protect.js";
import { authorize } from "../../middleware/authorize.js";
import {
  createProject,
  deleteProject,
  getAllProjects,
  getMyProjects,
  getProject,
  getProjectDetails,
  updateProject,
} from "../../controller/project-controller/core.controller.js";


const projectCoreRoutes = express.Router();

projectCoreRoutes.post("/", protect, createProject);

projectCoreRoutes.get("/:roomId/details", protect, getProjectDetails);

projectCoreRoutes.get("/my-project", protect, getMyProjects);

projectCoreRoutes.get("/", protect, getAllProjects);

projectCoreRoutes.get("/:roomId", protect, getProject);

projectCoreRoutes.patch(
  "/:roomId",
  protect,
  authorize(["owner", "co-leader"]),
  updateProject,
);

projectCoreRoutes.delete(
  "/:roomId",
  protect,
  authorize(["owner", "co-leader"]),
  deleteProject,
);

export default projectCoreRoutes;
