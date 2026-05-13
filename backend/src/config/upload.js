// config/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";

const createStorage = (subfolder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join("public", "uploads", subfolder);

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log("Created folder:", uploadDir);
      }

      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      console.log("Uploading:", uniqueName);
      cb(null, uniqueName);
    },
  });

const fileFilter = (req, file, cb) => {
  console.log("File received:", file.originalname, file.mimetype);
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files!"), false);
  }
};

const createUpload = (subfolder) =>
  multer({
    storage: createStorage(subfolder),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter,
  });

export const uploadPejabat = createUpload("pejabat");
export const uploadBerita = createUpload("berita");
export const uploadPopup = createUpload("popup");
export default uploadPejabat;
