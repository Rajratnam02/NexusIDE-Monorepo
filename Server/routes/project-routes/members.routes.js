import express from "express";
import { protect } from "../../middleware/protect.js";
import { authorize } from "../../middleware/authorize.js";
import {
  acceptJoin,
  addMembers,
  blockUser,
  changeRole,
  getAllMembers,
  getBlockedMembers,
  getPendingMembers,
  rejectJoin,
  removeMembers,
  unblockUser,
} from "../../controller/project-controller/member.controller.js";

const memberManagementRoutes = express.Router();

memberManagementRoutes.get(
  "/:roomId/members",
  protect,
  authorize(["owner", "co-leader"]),
  getAllMembers,
);
memberManagementRoutes.get(
  "/:roomId/pending",
  protect,
  authorize(["owner", "co-leader"]),
  getPendingMembers,
);
memberManagementRoutes.get(
  "/:roomId/blocked",
  protect,
  authorize(["owner", "co-leader"]),
  getBlockedMembers,
);

memberManagementRoutes.post(
  "/:roomId/members/:userId/accept",
  protect,
  authorize(["owner", "co-leader"]),
  acceptJoin,
);
memberManagementRoutes.post(
  "/:roomId/members/:userId/reject",
  protect,
  authorize(["owner", "co-leader"]),
  rejectJoin,
);
memberManagementRoutes.post(
  "/:roomId/members/:userId/block",
  protect,
  authorize(["owner", "co-leader"]),
  blockUser,
);
memberManagementRoutes.post(
  "/:roomId/members/:userId/unblock",
  protect,
  authorize(["owner", "co-leader"]),
  unblockUser,
);
memberManagementRoutes.post(
  "/:roomId/members/:userId/add",
  protect,
  authorize(["owner", "co-leader"]),
  addMembers,
);
memberManagementRoutes.delete(
  "/:roomId/members/:userId",
  protect,
  authorize(["owner", "co-leader"]),
  removeMembers,
);
memberManagementRoutes.patch(
  "/:roomId/members/:userId/role",
  protect,
  authorize(["owner", "co-leader"]),
  changeRole,
);

export default memberManagementRoutes;
