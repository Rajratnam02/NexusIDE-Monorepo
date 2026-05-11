import express from "express";
import { createServer } from "http";
import { configDotenv } from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import compression from "compression";
import { initSocket } from "./realtime/socket.js";
import appRoutes from "./routes/api.routes.js";
import connectMongoose from "./config/db.config.js";


configDotenv();
connectMongoose();
const app = express();
const httpServer = createServer(app);
initSocket(httpServer);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

app.use(morgan("combined"));

app.use(compression());

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "10mb" })); 

app.use("/api",appRoutes);


app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Something went wrong!" });
});

const port = process.env.PORT || 5000;

const server = httpServer.listen(port, () => {
  console.log("Server is running on port", port);
});


