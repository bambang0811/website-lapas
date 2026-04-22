-- Create Database
CREATE DATABASE IF NOT EXISTS lapas_karawang;
USE lapas_karawang;

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Berita Table
CREATE TABLE IF NOT EXISTS berita (
  id INT PRIMARY KEY AUTO_INCREMENT,
  judul VARCHAR(255) NOT NULL,
  excerpt TEXT,
  konten LONGTEXT NOT NULL,
  gambar_url VARCHAR(500),
  tanggal_publikasi DATETIME DEFAULT CURRENT_TIMESTAMP,
  penulis VARCHAR(100),
  kategori VARCHAR(100),
  status VARCHAR(50) DEFAULT 'published',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Pejabat Table
CREATE TABLE IF NOT EXISTS pejabat (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama VARCHAR(255) NOT NULL,
  jabatan VARCHAR(255) NOT NULL,
  foto_url VARCHAR(500),
  email VARCHAR(100),
  telepon VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert Seed Data for Users
INSERT INTO users (username, password, role) VALUES 
('admin', 'admin123', 'admin'),
('editor', 'editor123', 'editor');

-- Insert Seed Data for Berita
INSERT INTO berita (judul, excerpt, konten, penulis, kategori, status) VALUES 
('Selamat Datang di LAPAS Karawang', 'Lembaga Pemasyarakatan Karawang menyambut Anda', 'Kami adalah lembaga pemasyarakatan yang berkomitmen untuk pembinaan narapidana dengan standar internasional.', 'Admin', 'Umum', 'published'),
('Program Pembinaan Narapidana', 'Informasi tentang program pembinaan', 'Kami menyediakan berbagai program pembinaan untuk meningkatkan keterampilan dan karakter narapidana.', 'Admin', 'Program', 'published'),
('Fasilitas Kesehatan', 'Fasilitas kesehatan terbaik untuk narapidana', 'LAPAS Karawang dilengkapi dengan fasilitas kesehatan modern dan tenaga medis profesional.', 'Admin', 'Fasilitas', 'published');

-- Insert Seed Data for Pejabat
INSERT INTO pejabat (nama, jabatan, email, telepon) VALUES 
('Drs. Budi Santoso', 'Kepala Lembaga Pemasyarakatan', 'budi.santoso@lapas.go.id', '0267-123456'),
('Ir. Siti Nurhaliza', 'Wakil Kepala Bidang Keamanan', 'siti.nurhaliza@lapas.go.id', '0267-123457'),
('Dr. Ahmad Wijaya', 'Kepala Bidang Pembinaan', 'ahmad.wijaya@lapas.go.id', '0267-123458'),
('Hj. Endah Setiawati', 'Kepala Bidang Kesehatan', 'endah.setiawati@lapas.go.id', '0267-123459');
