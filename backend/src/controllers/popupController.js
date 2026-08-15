import fs from "fs";
import fsPromises from "fs/promises";

import { getPool } from "../config/database.js";
import { uploadToCloudinary } from "../config/cloudinary.js";

const pool = getPool();

const uploadPopupImage = async (file) => {
  if (!file) {
    throw new Error("req.file tidak tersedia");
  }

  console.log("=== POPUP FILE ===");
  console.log("originalname:", file.originalname);
  console.log("filename:", file.filename);
  console.log("path:", file.path);
  console.log("mimetype:", file.mimetype);
  console.log("size:", file.size);

  if (!file.path) {
    throw new Error("Path file popup tidak tersedia");
  }

  if (!fs.existsSync(file.path)) {
    throw new Error(`File popup tidak ditemukan: ${file.path}`);
  }

  const buffer = await fsPromises.readFile(file.path);

  console.log("Buffer size:", buffer.length);

  if (!buffer.length) {
    throw new Error("File popup kosong");
  }

  console.log("Uploading popup ke Cloudinary...");

  const uploaded = await uploadToCloudinary(
  buffer,
  "popup",
  "image",
  {
    width: 1080,
    height: 1350,
    crop: "limit",
    quality: "auto",
  }
);

  console.log("Cloudinary result:", uploaded);

  if (!uploaded?.secure_url) {
    throw new Error(
      "Cloudinary tidak mengembalikan secure_url"
    );
  }

  return uploaded.secure_url;
};

export async function getActivePopup(req, res) {
  try {
    const [rows] = await pool.query(
      `
      SELECT *
      FROM popup_messages
      WHERE active = 1
      AND image_url IS NOT NULL
      AND image_url != ''
      ORDER BY updated_at DESC
      LIMIT 1
      `
    );

    return res.json(rows[0] || null);
  } catch (error) {
    console.error("getActivePopup error:", error);

    return res.status(500).json({
      message: "Gagal memuat popup",
      error: error.message,
    });
  }
}

export async function getAllPopups(req, res) {
  try {
    const [rows] = await pool.query(
      `
      SELECT *
      FROM popup_messages
      ORDER BY updated_at DESC
      `
    );

    return res.json(rows);
  } catch (error) {
    console.error("getAllPopups error:", error);

    return res.status(500).json({
      message: "Gagal memuat daftar popup",
      error: error.message,
    });
  }
}

export async function createPopup(req, res) {
  try {
    console.log("=== CREATE POPUP ===");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const active =
      req.body.active === "1" ||
      req.body.active === "true" ||
      req.body.active === 1 ||
      req.body.active === true;

    if (!req.file && !req.body.image_url) {
      return res.status(400).json({
        message: "Gambar popup wajib dipilih",
      });
    }

    if (active) {
      await pool.query(
        "UPDATE popup_messages SET active = 0 WHERE active = 1"
      );
    }

    let imageUrl = req.body.image_url || null;

    if (req.file) {
      imageUrl = await uploadPopupImage(req.file);
    }

    if (!imageUrl) {
      throw new Error(
        "image_url kosong setelah proses upload"
      );
    }

    console.log("IMAGE URL FINAL:", imageUrl);

    const [result] = await pool.query(
      `
      INSERT INTO popup_messages
      (image_url, active)
      VALUES (?, ?)
      `,
      [
        imageUrl,
        active ? 1 : 0,
      ]
    );

    const [rows] = await pool.query(
      `
      SELECT *
      FROM popup_messages
      WHERE id = ?
      `,
      [result.insertId]
    );

    return res.status(201).json(rows[0]);
  } catch (error) {
    console.error("createPopup error:", error);

    return res.status(500).json({
      message: "Gagal membuat popup",
      error: error.message,
    });
  }
}

export async function updatePopup(req, res) {
  try {
    console.log("=== UPDATE POPUP ===");
    console.log("PARAMS:", req.params);
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { id } = req.params;

    const [existingRows] = await pool.query(
      `
      SELECT *
      FROM popup_messages
      WHERE id = ?
      `,
      [id]
    );

    if (!existingRows.length) {
      return res.status(404).json({
        message: "Popup tidak ditemukan",
      });
    }

    const existing = existingRows[0];

    let imageUrl = existing.image_url;

    if (req.file) {
      imageUrl = await uploadPopupImage(req.file);
    } else if (
      typeof req.body.image_url !== "undefined" &&
      req.body.image_url !== ""
    ) {
      imageUrl = req.body.image_url;
    }

    if (!imageUrl) {
      throw new Error(
        "image_url kosong setelah proses update"
      );
    }

    const active =
      req.body.active === "1" ||
      req.body.active === "true" ||
      req.body.active === 1 ||
      req.body.active === true;

    if (active) {
      await pool.query(
        "UPDATE popup_messages SET active = 0 WHERE active = 1"
      );
    }

    await pool.query(
      `
      UPDATE popup_messages
      SET image_url = ?,
          active = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
      `,
      [
        imageUrl,
        active ? 1 : 0,
        id,
      ]
    );

    const [rows] = await pool.query(
      `
      SELECT *
      FROM popup_messages
      WHERE id = ?
      `,
      [id]
    );

    return res.json(rows[0]);
  } catch (error) {
    console.error("updatePopup error:", error);

    return res.status(500).json({
      message: "Gagal memperbarui popup",
      error: error.message,
    });
  }
}

export async function deletePopup(req, res) {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      "DELETE FROM popup_messages WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Popup tidak ditemukan",
      });
    }

    return res.json({
      message: "Popup berhasil dihapus",
    });
  } catch (error) {
    console.error("deletePopup error:", error);

    return res.status(500).json({
      message: "Gagal menghapus popup",
      error: error.message,
    });
  }
}