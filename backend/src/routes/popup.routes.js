import express from "express";
import { uploadPopup } from "../config/upload.js";

import {
  getActivePopup,
  getAllPopups,
  createPopup,
  updatePopup,
  deletePopup,
} from "../controllers/popupController.js";

const router = express.Router();

// Ambil popup aktif
router.get("/", getActivePopup);

// Ambil semua popup untuk admin
router.get("/all", getAllPopups);

// Buat popup baru
router.post(
  "/",
  uploadPopup.single("image"),
  createPopup
);

// Update popup
router.put(
  "/:id",
  uploadPopup.single("image"),
  updatePopup
);

// Hapus popup
router.delete("/:id", deletePopup);

export default router;