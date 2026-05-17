import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

// aktifkan cors
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});