import express from "express";
import { createServer } from "http";
import { configDotenv } from "dotenv";
import { initSocket } from "./realtime/socket.js";

configDotenv();
const app = express();
const httpServer = createServer(app);
initSocket(httpServer);

app.use(express.json());


const port = process.env.PORT || 5000;

httpServer.listen(port, () => {
  console.log("Server is running on port", port);
});
