import express from "express";
import messageRoutes from "./message.routes.js";
import projectRoutes from "./project-routes/project.routes.js";
import executeRoutes from "./execute.routes.js";

const appRoutes = express.Router();

appRoutes.use("/message", messageRoutes);
appRoutes.use("/project", projectRoutes);
appRoutes.use("/execute", executeRoutes);

export default appRoutes;
