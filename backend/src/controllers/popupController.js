import { getPool } from "../config/database.js";

const pool = getPool();

export async function getActivePopup(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM popup_messages WHERE active = 1 ORDER BY updated_at DESC LIMIT 1",
    );

    return res.json(rows[0] || null);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal memuat popup" });
  }
}

export async function getAllPopups(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM popup_messages ORDER BY updated_at DESC",
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal memuat daftar popup" });
  }
}

export async function createPopup(req, res) {
  try {
    const active =
      req.body.active === "1" ||
      req.body.active === "true" ||
      req.body.active === 1;

    if (active) {
      await pool.query("UPDATE popup_messages SET active = 0 WHERE active = 1");
    }

    const imageUrl = req.file
      ? `/uploads/popup/${req.file.filename}`
      : req.body.image_url || null;

    const [result] = await pool.query(
      "INSERT INTO popup_messages (image_url, active) VALUES (?, ?)",
      [imageUrl, active ? 1 : 0],
    );

    const [rows] = await pool.query(
      "SELECT * FROM popup_messages WHERE id = ?",
      [result.insertId],
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal membuat popup" });
  }
}

export async function updatePopup(req, res) {
  try {
    const { id } = req.params;
    const [existingRows] = await pool.query(
      "SELECT * FROM popup_messages WHERE id = ?",
      [id],
    );
    if (!existingRows.length) {
      return res.status(404).json({ message: "Popup tidak ditemukan" });
    }

    const existing = existingRows[0];
    let imageUrl = existing.image_url;

    if (req.file) {
      imageUrl = `/uploads/popup/${req.file.filename}`;
    } else if (
      typeof req.body.image_url !== "undefined" &&
      req.body.image_url !== ""
    ) {
      imageUrl = req.body.image_url;
    }

    const active =
      req.body.active === "1" ||
      req.body.active === "true" ||
      req.body.active === 1;

    if (active) {
      await pool.query("UPDATE popup_messages SET active = 0 WHERE active = 1");
    }

    await pool.query(
      "UPDATE popup_messages SET image_url = ?, active = ? WHERE id = ?",
      [imageUrl, active ? 1 : 0, id],
    );

    const [rows] = await pool.query(
      "SELECT * FROM popup_messages WHERE id = ?",
      [id],
    );
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal memperbarui popup" });
  }
}

export async function deletePopup(req, res) {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      "DELETE FROM popup_messages WHERE id = ?",
      [id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Popup tidak ditemukan" });
    }

    res.json({ message: "Popup berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menghapus popup" });
  }
}
