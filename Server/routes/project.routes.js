import express from "express";
import {
  acceptJoin,
  addMembers,
  blockUser,
  cancelJoin,
  changeRole,
  createFile,
  createProject,
  deleteFile,
  deleteProject,
  getAllFiles,
  getAllMembers,
  getAllProjects,
  getBlockedMembers,
  getFile,
  getMyProjects,
  getPendingMembers,
  getProject,
  getProjectDetails,
  joinProject,
  leaveProject,
  rejectJoin,
  removeMembers,
  requestJoin,
  unblockUser,
  updateFile,
  updateProject,
} from "../controller/project.controller.js";
import { protect } from "../middleware/protect.js";
import { authorize } from "../middleware/authorize.js";

const projectRoutes = express.Router();

// -- Core Project Routes --
projectRoutes.post("/", protect, createProject);
projectRoutes.get("/:roomId/details", protect,getProjectDetails);
projectRoutes.get("/my-project", protect, getMyProjects);
projectRoutes.get("/", protect, getAllProjects);
projectRoutes.get("/:roomId", protect, getProject);

projectRoutes.patch(
  "/:roomId",
  protect,
  authorize(["owner", "co-leader"]),
  updateProject,
);
projectRoutes.delete(
  "/:roomId",
  protect,
  authorize(["owner", "co-leader"]),
  deleteProject,
);

// -- Access & Join Flow Routes --
projectRoutes.put("/:roomId/join", protect, joinProject);
projectRoutes.post("/:roomId/request", protect, requestJoin);
projectRoutes.delete("/:roomId/request", protect, cancelJoin);
projectRoutes.delete("/:roomId/leave", protect, leaveProject);

// -- Admin & Member Management --
projectRoutes.get(
  "/:roomId/members",
  protect,
  authorize(["owner", "co-leader"]),
  getAllMembers,
);
projectRoutes.get(
  "/:roomId/pending",
  protect,
  authorize(["owner", "co-leader"]),
  getPendingMembers,
);
projectRoutes.get(
  "/:roomId/blocked",
  protect,
  authorize(["owner", "co-leader"]),
  getBlockedMembers,
);

// -- Member Management Actions --
projectRoutes.post(
  "/:roomId/members/:userId/accept",
  protect,
  authorize(["owner", "co-leader"]),
  acceptJoin,
);
projectRoutes.post(
  "/:roomId/members/:userId/reject",
  protect,
  authorize(["owner", "co-leader"]),
  rejectJoin,
);
projectRoutes.post(
  "/:roomId/members/:userId/block",
  protect,
  authorize(["owner", "co-leader"]),
  blockUser,
);
projectRoutes.post(
  "/:roomId/members/:userId/unblock",
  protect,
  authorize(["owner", "co-leader"]),
  unblockUser,
);
projectRoutes.post(
  "/:roomId/members/:userId/add",
  protect,
  authorize(["owner", "co-leader"]),
  addMembers,
);
projectRoutes.delete(
  "/:roomId/members/:userId",
  protect,
  authorize(["owner", "co-leader"]),
  removeMembers,
);
projectRoutes.patch(
  "/:roomId/members/:userId/role",
  protect,
  authorize(["owner", "co-leader"]),
  changeRole,
);

// -- File Management --
projectRoutes.get(
  "/:roomId/files",
  protect,
  authorize(["owner", "co-leader", "editor"]),
  getAllFiles,
);
projectRoutes.post(
  "/:roomId/files",
  protect,
  authorize(["owner", "co-leader", "editor"]),
  createFile,
);
projectRoutes.get(
  "/:roomId/files/:fileId",
  protect,
  authorize(["owner", "co-leader", "editor"]),
  getFile,
);
projectRoutes.patch(
  "/:roomId/files/:fileId",
  protect,
  authorize(["owner", "co-leader", "editor"]),
  updateFile,
);
projectRoutes.delete(
  "/:roomId/files/:fileId",
  protect,
  authorize(["owner", "co-leader", "editor"]),
  deleteFile,
);

export default projectRoutes;
