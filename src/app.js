import express from "express";
import mongoose from "mongoose";
import Redis from "ioredis";
import cookieParser from "cookie-parser";
import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const connectDB = async () => {
  try {
    const connected = await mongoose.connect(process.env.MONGODB_URL, {
      autoIndex: true,
    });

    if (connected) {
      console.log("MongoDB connected successfully");
    }
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

export default app;
export { connectDB, redis };
