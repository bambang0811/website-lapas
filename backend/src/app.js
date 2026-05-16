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

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://lapaskarawang.page.gd"
];

app.use(cors({
  origin: function (origin, callback) {
    // izinkan request tanpa origin
    if (!origin) return callback(null, true);

    // izinkan localhost & domain production
    if (
      allowedOrigins.includes(origin) ||
      origin.startsWith("http://localhost:") ||
      origin.startsWith("http://127.0.0.1:")
    ) {
      callback(null, true);
    } else {
      callback(null, true); // sementara izinkan semua agar aman
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

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

// FIX DOUBLE SLASH
app.use((req, res, next) => {
  if (req.url.includes("//")) {
    req.url = req.url.replace(/\/\/+/, "/");
  }
  next();
});

// STATIC UPLOADS
app.use("/uploads", express.static(path.resolve("public", "uploads")));

console.log("Uploads served from: https://lapas-backend.onrender.com/uploads");

export default app;