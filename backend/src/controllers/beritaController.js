import { getPool } from "../config/database.js";

const pool = getPool();

export async function getAllBerita(req, res) {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM berita ORDER BY tanggal_publikasi DESC",
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal memuat berita" });
  }
}

export async function getBeritaById(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM berita WHERE id = ?", [id]);
    if (!rows.length) {
      return res.status(404).json({ message: "Berita tidak ditemukan" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal memuat berita" });
  }
}

export async function createBerita(req, res) {
  try {
    const {
      judul,
      excerpt,
      konten,
      gambar_url,
      tanggal_publikasi,
      penulis,
      kategori,
      status,
    } = req.body;
    let imageUrl = gambar_url || null;

    if (req.file) {
      imageUrl = `/uploads/berita/${req.file.filename}`;
    }

    const [result] = await pool.query(
      "INSERT INTO berita (judul, excerpt, konten, gambar_url, tanggal_publikasi, penulis, kategori, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        judul,
        excerpt,
        konten,
        imageUrl,
        tanggal_publikasi || new Date(),
        penulis,
        kategori,
        status || "published",
      ],
    );
    const [rows] = await pool.query("SELECT * FROM berita WHERE id = ?", [
      result.insertId,
    ]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal membuat berita" });
  }
}

export async function updateBerita(req, res) {
  try {
    const { id } = req.params;
    const {
      judul,
      excerpt,
      konten,
      gambar_url,
      tanggal_publikasi,
      penulis,
      kategori,
      status,
    } = req.body;
    const [existingRows] = await pool.query(
      "SELECT gambar_url FROM berita WHERE id = ?",
      [id],
    );
    if (!existingRows.length) {
      return res.status(404).json({ message: "Berita tidak ditemukan" });
    }

    let imageUrl = existingRows[0].gambar_url;
    if (typeof gambar_url !== "undefined") {
      imageUrl = gambar_url;
    }

    if (req.file) {
      imageUrl = `/uploads/berita/${req.file.filename}`;
    }

    const [result] = await pool.query(
      "UPDATE berita SET judul = ?, excerpt = ?, konten = ?, gambar_url = ?, tanggal_publikasi = ?, penulis = ?, kategori = ?, status = ? WHERE id = ?",
      [
        judul,
        excerpt,
        konten,
        imageUrl,
        tanggal_publikasi,
        penulis,
        kategori,
        status,
        id,
      ],
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Berita tidak ditemukan" });
    }
    const [rows] = await pool.query("SELECT * FROM berita WHERE id = ?", [id]);
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal memperbarui berita" });
  }
}

export async function deleteBerita(req, res) {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM berita WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Berita tidak ditemukan" });
    }
    res.json({ message: "Berita berhasil dihapus" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal menghapus berita" });
  }
}
