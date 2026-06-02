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
const CLIENT_URL = process.env.CLIENT_URL;

// ---------- TRUST PROXY ----------
app.set("trust proxy", 1);

// ---------- SECURITY ----------
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

// ---------- CORS ----------
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

// ---------- RATE LIMIT ----------
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: NODE_ENV === "production" ? 100 : 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many requests. Try again later.",
    },
  })
);

// ---------- PERFORMANCE ----------
app.use(compression());

// ---------- LOGGING ----------
if (NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// ---------- PARSERS ----------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ---------- HEALTH CHECK ----------
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ---------- ROUTES ----------
app.use("/api", appRoutes);

// ---------- 404 HANDLER ----------
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// ---------- GLOBAL ERROR HANDLER ----------
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.statusCode || 500).json({
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

// ---------- START SERVER ----------
const startServer = async () => {
  try {
    await connectMongoose();

    initSocket(httpServer);

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${NODE_ENV}`);
    });
  } catch (error) {
    console.error("Startup Failed:", error);
    process.exit(1);
  }
};

startServer();

// ---------- GRACEFUL SHUTDOWN ----------
const gracefulShutdown = async () => {
  console.log("\n🛑 Gracefully shutting down...");

  httpServer.close(async () => {
    try {
      console.log("HTTP Server Closed");
      process.exit(0);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  });
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

// ---------- UNHANDLED ERRORS ----------
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("UNHANDLED REJECTION:", reason);
  process.exit(1);
});