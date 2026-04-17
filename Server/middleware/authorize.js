import Project from "../models/project.model.js";

export const authorize = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const { roomId } = req.params;
      const userId = req.user._id;

      const project = await Project.findOne({ roomId });

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      if (project.blockedUsers && project.blockedUsers.includes(userId)) {
        return res
          .status(403)
          .json({
            message: "Access denied: You are blocked from this project",
          });
      }

      const isOwner = project.owner.toString() === userId.toString();
      if (isOwner) {
        req.project = project;
        req.userRole = "owner";
        return next();
      }

      const membership = project.members.find(
        (m) => m.user.toString() === userId.toString(),
      );

      const isViewing = req.method === "GET";
      if (project.isPublic && isViewing && !membership) {
        req.project = project;
        req.userRole = "viewer"; 
        return next();
      }

      if (!membership) {
        return res
          .status(403)
          .json({
            message: "Access denied: You are not a member of this project",
          });
      }

      if (membership.status !== "accepted") {
        return res.status(403).json({
          message: `Access denied: Your membership is currently ${membership.status}`,
        });
      }

      if (!allowedRoles.includes(membership.role)) {
        return res.status(403).json({
          message: `Forbidden: This action requires one of the following roles: ${allowedRoles.join(", ")}`,
        });
      }

      req.project = project;
      req.userRole = membership.role;

      next();
    } catch (error) {
      console.error("Authorization Error:", error.message);
      return res
        .status(500)
        .json({ message: "Internal server error during authorization" });
    }
  };
};
