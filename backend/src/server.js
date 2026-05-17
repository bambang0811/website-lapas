import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../public/uploads"))
);

// Test route
app.get("/", (req, res) => {
  res.send("Backend running...");
});

// PORT
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});