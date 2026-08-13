import { getPool } from "../config/database.js";
import { uploadToCloudinary } from "../config/cloudinary.js";

const pool = getPool();

const normalizeImageList = (imageValue, uploadedFiles = []) => {
  const parsed = [];

  if (Array.isArray(imageValue)) {
    imageValue.forEach((item) => {
      if (item) parsed.push(item);
    });
  } else if (typeof imageValue === "string") {
    const trimmed = imageValue.trim();
    if (!trimmed) {
      if (uploadedFiles.length) {
        return uploadedFiles.map((file) => file?.secure_url || file);
      }
      return [];
    }

    try {
      const jsonValue = JSON.parse(trimmed);
      if (Array.isArray(jsonValue)) {
        jsonValue.forEach((item) => {
          if (item) parsed.push(item);
        });
      }
    } catch {
      if (trimmed.includes(",")) {
        trimmed
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
          .forEach((item) => parsed.push(item));
      } else {
        parsed.push(trimmed);
      }
    }
  }

  if (uploadedFiles.length) {
    uploadedFiles.forEach((file) => {
      if (file?.secure_url) parsed.push(file.secure_url);
      else if (typeof file === "string") parsed.push(file);
    });
  }

  return [...new Set(parsed.filter(Boolean))];
};

const uploadFilesToCloudinary = async (files = []) => {
  const uploadedUrls = [];

  for (const file of files) {
    if (!file || !file.buffer) continue;
    const uploaded = await uploadToCloudinary(file.buffer, "berita");
    if (uploaded?.secure_url) {
      uploadedUrls.push(uploaded.secure_url);
    }
  }

  return uploadedUrls;
};

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

    const uploadedFiles = req.files || [];
    const uploadedUrls = await uploadFilesToCloudinary(uploadedFiles);
    const imageList = normalizeImageList(gambar_url, uploadedUrls);
    const imageUrl = imageList.length ? JSON.stringify(imageList) : null;

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
    let {
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

    const uploadedFiles = req.files || [];
    const uploadedUrls = await uploadFilesToCloudinary(uploadedFiles);
    let imageList = normalizeImageList(existingRows[0].gambar_url, []);

    if (typeof gambar_url !== "undefined") {
      imageList = normalizeImageList(gambar_url, uploadedUrls);
    } else if (uploadedUrls.length) {
      imageList = normalizeImageList([], uploadedUrls);
    }

    const imageUrl = imageList.length ? JSON.stringify(imageList) : null;

    const [result] = await pool.query(
      "UPDATE berita SET judul = ?, excerpt = ?, konten = ?, gambar_url = ?, tanggal_publikasi = ?, penulis = ?, kategori = ?, status = ? WHERE id = ?",
      [
        judul,
        excerpt,
        konten,
        imageUrl,
        tanggal_publikasi || new Date(),
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
    console.error("updateBerita error:", error);
    console.error("Request body:", req.body);
    console.error("Request file:", req.files);
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
