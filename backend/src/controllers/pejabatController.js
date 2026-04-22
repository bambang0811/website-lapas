import pool from '../config/database.js';

export async function getAllPejabat(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM pejabat ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil data pejabat' });
  }
}

export async function getPejabatById(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM pejabat WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Pejabat tidak ditemukan' });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil data pejabat' });
  }
}

export async function createPejabat(req, res) {
  try {
    const { nama, jabatan, foto_url, email, telepon } = req.body;
    const [result] = await pool.query(
      'INSERT INTO pejabat (nama, jabatan, foto_url, email, telepon) VALUES (?, ?, ?, ?, ?)',
      [nama, jabatan, foto_url, email, telepon]
    );
    const [rows] = await pool.query('SELECT * FROM pejabat WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal membuat data pejabat' });
  }
}

export async function updatePejabat(req, res) {
  try {
    const { nama, jabatan, foto_url, email, telepon } = req.body;
    await pool.query(
      'UPDATE pejabat SET nama = ?, jabatan = ?, foto_url = ?, email = ?, telepon = ? WHERE id = ?',
      [nama, jabatan, foto_url, email, telepon, req.params.id]
    );
    const [rows] = await pool.query('SELECT * FROM pejabat WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Pejabat tidak ditemukan' });
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengupdate data pejabat' });
  }
}

export async function deletePejabat(req, res) {
  try {
    const [result] = await pool.query('DELETE FROM pejabat WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Pejabat tidak ditemukan' });
    res.json({ message: 'Data pejabat berhasil dihapus' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal menghapus data pejabat' });
  }
}
