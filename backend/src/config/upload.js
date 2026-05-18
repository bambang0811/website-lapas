// config/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const normalizeFilename = (originalname) => {
  const ext = path.extname(originalname).toLowerCase();
  let name = path.basename(originalname, ext);

  if (name.toLowerCase().endsWith(ext)) {
    name = name.slice(0, -ext.length);
  }

  name = name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9\-_.]/g, "");
  return `${Date.now()}-${name}${ext}`;
};

const createStorage = (subfolder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      // Save uploads to the public/uploads folder at the project root
      const uploadDir = path.join(__dirname, "..", "..", "public", "uploads", subfolder);

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log("Created folder:", uploadDir);
      }

      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueName = normalizeFilename(file.originalname);
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

const createMemoryUpload = () =>
  multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter,
  });

export const uploadPejabat = createUpload("pejabat");
export const uploadBerita = createMemoryUpload();
export const uploadPopup = createUpload("popup");
export default uploadPejabat;
