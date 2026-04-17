import express from "express";
import { createServer } from "http";
import { configDotenv } from "dotenv";
import { initSocket } from "./realtime/socket.js";
import appRoutes from "./routes/api.routes.js";

configDotenv();
const app = express();
const httpServer = createServer(app);
initSocket(httpServer);

app.use(express.json());

app.use("/",appRoutes);


const port = process.env.PORT || 5000;

httpServer.listen(port, () => {
  console.log("Server is running on port", port);
});
