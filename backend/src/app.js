import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.routes.js";
import beritaRoutes from "./routes/berita.routes.js";
import pejabatRoutes from "./routes/pejabat.routes.js";
import popupRoutes from "./routes/popup.routes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/berita", beritaRoutes);
app.use("/api/pejabat", pejabatRoutes);
app.use("/api/popup", popupRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend running successfully");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Static uploads
app.use("/uploads", express.static(path.resolve("public", "uploads")));

console.log("Uploads served from: https://lapas-backend.onrender.com/uploads");

export default app;