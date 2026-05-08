import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import authRoutes from "./routes/auth.routes.js";
import beritaRoutes from "./routes/berita.routes.js";
import pejabatRoutes from "./routes/pejabat.routes.js";

dotenv.config();

const app = express(); // HARUS DI ATAS

const PORT = process.env.API_PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(cors({
  origin: CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json({ limit: "10mb" })); // biar aman

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/berita", beritaRoutes);
app.use("/api/pejabat", pejabatRoutes);

// TEST
app.get("/", (req, res) => {
  res.send("Backend jalan bro 🚀");
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

app.use('/uploads', express.static(path.resolve('public', 'uploads')));
console.log('📁 Uploads served from: http://localhost:5000/uploads');

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});