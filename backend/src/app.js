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

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/berita", beritaRoutes);
app.use("/api/pejabat", pejabatRoutes);
app.use("/api/popup", popupRoutes);

// TEST
app.get("/", (req, res) => {
  res.send("Backend running successfully");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use((req, res, next) => {
  if (req.url.includes("//")) {
    req.url = req.url.replace(/\/\/+/, "/");
  }
  next();
});

app.use("/uploads", express.static(path.resolve("public", "uploads")));

console.log("Uploads served from: http://localhost:5000/uploads");

export default app;
