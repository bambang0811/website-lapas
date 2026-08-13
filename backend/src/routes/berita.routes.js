import express from "express";
import { uploadBerita } from "../config/upload.js";
import {
  getAllBerita,
  getBeritaById,
  createBerita,
  updateBerita,
  deleteBerita,
} from "../controllers/beritaController.js";

const router = express.Router();

router.get("/", getAllBerita);
router.get("/:id", getBeritaById);
router.post("/", uploadBerita.array("gambar", 10), createBerita);
router.put("/:id", uploadBerita.array("gambar", 10), updateBerita);
router.delete("/:id", deleteBerita);

export default router;