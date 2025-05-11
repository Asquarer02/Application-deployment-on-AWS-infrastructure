// src/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "*", // For development. In production, restrict to your frontend URL.
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  })
);
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Simple health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "UP", message: "Backend is running" });
});

// Basic error handling (can be improved)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

export default app;
