import express from "express";
import messageRoutes from "./message.routes.js";

const appRoutes = express.Router();

appRoutes.use("/message",messageRoutes);

export default appRoutes;