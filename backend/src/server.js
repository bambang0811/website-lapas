import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// IMPORT ROUTES
import beritaRoutes from "./routes/berita.routes.js";
import pejabatRoutes from "./routes/pejabat.routes.js";
import popupRoutes from "./routes/popup.routes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// STATIC UPLOADS
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../public/uploads"))
);

// API ROUTES
app.use("/api/berita", beritaRoutes);
app.use("/api/pejabat", pejabatRoutes);
app.use("/api/popup", popupRoutes);

// TEST
app.get("/", (req, res) => {
  res.send("Backend running...");
});

// PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});