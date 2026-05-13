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

router.get("/", getActivePopup);
router.get("/all", getAllPopups);
router.post("/", uploadPopup.single("image"), createPopup);
router.put("/:id", uploadPopup.single("image"), updatePopup);
router.delete("/:id", deletePopup);

export default router;
