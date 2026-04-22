import express from "express";
import { getAllBerita, getBeritaById, createBerita, updateBerita, deleteBerita } from "../controllers/beritaController.js";

const router = express.Router();
router.get("/", getAllBerita);
router.get("/:id", getBeritaById);
router.post("/", createBerita);
router.put("/:id", updateBerita);
router.delete("/:id", deleteBerita);
export default router;
