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

// Load environment variables
configDotenv({
  quiet: true,
});

// Connect Database
connectMongoose();

const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO
initSocket(httpServer);

// Trust proxy
app.set("trust proxy", 1);

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan("combined"));

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});

app.use(limiter);

// CORS middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

// Body parser middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api", appRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// Handle unknown routes
app.use((req,res,next)=>{

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🌐 REQUEST RECEIVED");
    console.log("Method:", req.method);
    console.log("URL:", req.originalUrl);
    console.log("Params:", req.params);
    console.log("Query:", req.query);
    console.log("Body:", req.body);
    console.log("Cookies:", req.cookies);
    console.log("Header Cookie:", req.headers.cookie);
    console.log("Authorization:", req.headers.authorization);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    next();
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong!",
  });
});

// Server Port
const port = process.env.PORT || 5000;

// Start server
httpServer.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});