import express from "express";
import messageRoutes from "./message.routes.js";
import projectRoutes from "./project.routes.js";

const appRoutes = express.Router();

appRoutes.use("/message",messageRoutes);
appRoutes.use("/project",projectRoutes);

export default appRoutes;