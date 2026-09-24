import express from "express";
import { body } from "express-validator";
import { protect } from "../../middleware/protect.js";
import { authorize } from "../../middleware/authorize.js";
import { validate } from "../../middleware/validate.js";
import { acceptJoin, addMembers, blockUser, changeRole, getAllMembers, getBlockedMembers, getPendingMembers, rejectJoin, removeMembers, unblockUser, joinProject, leaveProject, requestJoin, cancelJoin } from "../../controller/project-controller/member.controller.js";

const VALID_ROLES = ["co-leader", "editor", "viewer"];
const memberManagementRoutes = express.Router();

memberManagementRoutes.get("/:roomId/members", protect, authorize(["owner","co-leader","editor","viewer"]), getAllMembers);
memberManagementRoutes.get("/:roomId/pending", protect, authorize(["owner","co-leader"]), getPendingMembers);
memberManagementRoutes.get("/:roomId/blocked", protect, authorize(["owner","co-leader"]), getBlockedMembers);

memberManagementRoutes.post("/:roomId/join",    protect, joinProject);
memberManagementRoutes.post("/:roomId/leave",   protect, leaveProject);
memberManagementRoutes.post("/:roomId/request", protect, requestJoin);
memberManagementRoutes.post("/:roomId/cancel",  protect, cancelJoin);

memberManagementRoutes.post("/:roomId/members/:userId/accept", protect, authorize(["owner","co-leader"]), acceptJoin);
memberManagementRoutes.post("/:roomId/members/:userId/reject", protect, authorize(["owner","co-leader"]), rejectJoin);
memberManagementRoutes.post("/:roomId/members/:userId/block",  protect, authorize(["owner","co-leader"]), blockUser);
memberManagementRoutes.post("/:roomId/members/:userId/unblock",protect, authorize(["owner","co-leader"]), unblockUser);

memberManagementRoutes.post(
  "/:roomId/members/:userId/add",
  protect,
  authorize(["owner","co-leader"]),
  body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Must be a valid email").normalizeEmail(),
  body("role").optional().isIn(VALID_ROLES).withMessage("Role must be co-leader, editor, or viewer"),
  validate,
  addMembers,
);

memberManagementRoutes.delete("/:roomId/members/:userId", protect, authorize(["owner","co-leader"]), removeMembers);

memberManagementRoutes.patch(
  "/:roomId/members/:userId/role",
  protect,
  authorize(["owner","co-leader"]),
  body("newRole").notEmpty().withMessage("newRole is required").isIn(VALID_ROLES).withMessage("Role must be co-leader, editor, or viewer"),
  validate,
  changeRole,
);

export default memberManagementRoutes;
