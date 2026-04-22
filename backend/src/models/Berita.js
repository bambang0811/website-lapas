export const BeritaSchema = {
  id: 'INT PRIMARY KEY AUTO_INCREMENT',
  judul: 'VARCHAR(255) NOT NULL',
  excerpt: 'TEXT',
  konten: 'LONGTEXT NOT NULL',
  gambar_url: 'VARCHAR(500)',
  tanggal_publikasi: 'DATETIME DEFAULT CURRENT_TIMESTAMP',
  penulis: 'VARCHAR(100)',
  kategori: 'VARCHAR(100)',
  status: "VARCHAR(50) DEFAULT 'published'",
  created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
  updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
};
