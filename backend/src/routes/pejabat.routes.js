import express from "express";
import upload from "../config/upload.js";
import {
  getAllPejabat,
  createPejabat,
  updatePejabat,
  deletePejabat
} from "../controllers/pejabatController.js";

const router = express.Router();

router.get("/", getAllPejabat);
router.post("/", upload.single("foto"), createPejabat);
router.put("/:id", upload.single("foto"), updatePejabat);
router.delete("/:id", deletePejabat);

export default router;