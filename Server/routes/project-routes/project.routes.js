import express from "express";
import projectCoreRoutes from "./core.routes.js";
import memberManagementRoutes from "./members.routes.js";
import fileRoutes from "./files.routes.js";
const projectRoutes = express.Router();

projectRoutes.use("/core", projectCoreRoutes);
projectCoreRoutes.use("/member", memberManagementRoutes);
projectCoreRoutes.use("/files", fileRoutes);

export default projectRoutes;
