import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";

import { initSocket } from "./realtime/socket.js";
import appRoutes from "./routes/api.routes.js";
import connectMongoose from "./config/db.config.js";

dotenv.config({ quiet: true });

const app = express();
const httpServer = createServer(app);

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// ================= TRUST PROXY =================
app.set("trust proxy", 1);

// ================= SECURITY =================
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

// ================= CORS =================
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

// ================= RATE LIMITER =================
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: NODE_ENV === "production" ? 100 : 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many requests. Please try again later.",
    },
  })
);

// ================= PERFORMANCE =================
app.use(compression());

// ================= LOGGING =================
app.use(
  morgan(
    NODE_ENV === "development"
      ? "dev"
      : "combined"
  )
);

// ================= BODY PARSERS =================
app.use(express.json({ limit: "10mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

app.use(cookieParser());

// ================= HEALTH CHECK =================
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
    environment: NODE_ENV,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ================= API ROUTES =================
app.use("/api", appRoutes);

// ================= 404 HANDLER (EXPRESS 5 SAFE) =================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// ================= GLOBAL ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);

  res.status(err.status || 500).json({
    success: false,
    message:
      NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
    ...(NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
});

// ================= SERVER START =================
const startServer = async () => {
  try {
    console.log("Connecting database...");

    await connectMongoose();

    console.log("Database connected.");

    initSocket(httpServer);

    httpServer.listen(PORT, () => {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${NODE_ENV}`);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    });

  } catch (error) {
    console.error("SERVER STARTUP FAILED:", error);
    process.exit(1);
  }
};

startServer();

// ================= GRACEFUL SHUTDOWN =================
const gracefulShutdown = (signal) => {
  console.log(`\n${signal} received. Shutting down...`);

  httpServer.close(() => {
    console.log("HTTP server closed.");
    process.exit(0);
  });
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// ================= PROCESS ERROR HANDLING =================
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("UNHANDLED REJECTION:", reason);
  process.exit(1);
});