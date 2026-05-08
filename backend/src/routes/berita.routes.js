import express from "express";
import { uploadBerita } from "../config/upload.js";
import { getAllBerita, getBeritaById, createBerita, updateBerita, deleteBerita } from "../controllers/beritaController.js";

const router = express.Router();
router.get("/", getAllBerita);
router.get("/:id", getBeritaById);
router.post("/", uploadBerita.single("gambar"), createBerita);
router.put("/:id", uploadBerita.single("gambar"), updateBerita);
router.delete("/:id", deleteBerita);
export default router;
