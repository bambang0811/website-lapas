// pejabat.js - UPDATE INI
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Multer config untuk upload foto
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/pejabat/'); // Folder upload
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Hanya file gambar!'), false);
    }
  }
});

export const PejabatSchema = {
  id: 'INT PRIMARY KEY AUTO_INCREMENT',
  nama: 'VARCHAR(255) NOT NULL',
  jabatan: 'VARCHAR(255) NOT NULL',
  foto_url: 'VARCHAR(500)',  // ✅ Sudah benar
  email: 'VARCHAR(100)',
  telepon: 'VARCHAR(20)',
  created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
  updated_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
};

// API Routes
export const routes = (app, db) => {
  
  // ✅ GET - User Page
  app.get('/api/pejabat', async (req, res) => {
    try {
      const [rows] = await db.execute('SELECT * FROM pejabat ORDER BY created_at DESC');
      res.json(rows);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // ✅ POST - Admin Tambah
  app.post('/api/pejabat', upload.single('foto'), async (req, res) => {
    try {
      const { nama, jabatan, email, telepon } = req.body;
      let foto_url = null;
      
      // ✅ Handle foto upload
      if (req.file) {
        foto_url = `/uploads/pejabat/${req.file.filename}`;
      }

      const [result] = await db.execute(
        'INSERT INTO pejabat (nama, jabatan, foto_url, email, telepon) VALUES (?, ?, ?, ?, ?)',
        [nama, jabatan, foto_url, email, telepon]
      );

      res.json({ 
        success: true, 
        id: result.insertId,
        foto_url 
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // ✅ PUT - Edit
  app.put('/api/pejabat/:id', upload.single('foto'), async (req, res) => {
    try {
      const id = req.params.id;
      const { nama, jabatan, email, telepon } = req.body;
      let foto_url = req.body.foto_url; // existing foto

      if (req.file) {
        foto_url = `/uploads/pejabat/${req.file.filename}`;
      }

      await db.execute(
        'UPDATE pejabat SET nama=?, jabatan=?, foto_url=?, email=?, telepon=?, updated_at=NOW() WHERE id=?',
        [nama, jabatan, foto_url, email, telepon, id]
      );

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // ✅ DELETE
  app.delete('/api/pejabat/:id', async (req, res) => {
    try {
      const id = req.params.id;
      await db.execute('DELETE FROM pejabat WHERE id=?', [id]);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
};