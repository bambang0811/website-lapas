// Service untuk mengelola data berita
// Menggunakan backend API untuk persistensi data

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

class BeritaService {
  constructor() {
    // No initialization needed with backend
  }

  // Get semua berita dari backend
  async getAll() {
    try {
      const response = await fetch(`${API_BASE_URL}/berita`);
      if (!response.ok) {
        throw new Error(`Failed to fetch berita: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting berita:', error);
      return [];
    }
  }

  // Get berita by ID
  async getById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/berita/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch berita: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting berita by ID:', error);
      return null;
    }
  }

  // Get published berita
  async getPublished() {
    try {
      const berita = await this.getAll();
      return berita.filter(item => item.status === 'published');
    } catch (error) {
      console.error('Error getting published berita:', error);
      return [];
    }
  }

  // Add berita baru
  async add(beritaData) {
    try {
      const response = await fetch(`${API_BASE_URL}/berita`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('lapas_auth') ? JSON.parse(localStorage.getItem('lapas_auth')).token : ''}`
        },
        body: JSON.stringify({
          judul: beritaData.judul,
          excerpt: beritaData.excerpt,
          konten: beritaData.konten,
          gambar_url: beritaData.gambar_url || beritaData.gambar,
          penulis: beritaData.penulis || 'Admin LAPAS',
          kategori: beritaData.kategori,
          status: beritaData.status || 'draft'
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to add berita: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error adding berita:', error);
      throw error;
    }
  }

  // Update berita
  async update(id, updateData) {
    try {
      const response = await fetch(`${API_BASE_URL}/berita/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('lapas_auth') ? JSON.parse(localStorage.getItem('lapas_auth')).token : ''}`
        },
        body: JSON.stringify({
          judul: updateData.judul,
          excerpt: updateData.excerpt,
          konten: updateData.konten,
          gambar_url: updateData.gambar_url || updateData.gambar,
          penulis: updateData.penulis || 'Admin LAPAS',
          kategori: updateData.kategori,
          status: updateData.status
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to update berita: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating berita:', error);
      throw error;
    }
  }

  // Delete berita
  async delete(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/berita/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('lapas_auth') ? JSON.parse(localStorage.getItem('lapas_auth')).token : ''}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete berita: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error deleting berita:', error);
      throw error;
    }
  }

  // Search berita
  async search(query) {
    try {
      const berita = await this.getAll();
      const lowercaseQuery = query.toLowerCase();
      return berita.filter(item =>
        item.judul.toLowerCase().includes(lowercaseQuery) ||
        item.excerpt.toLowerCase().includes(lowercaseQuery) ||
        item.konten.toLowerCase().includes(lowercaseQuery) ||
        item.kategori.toLowerCase().includes(lowercaseQuery)
      );
    } catch (error) {
      console.error('Error searching berita:', error);
      return [];
    }
  }

  // Get berita by kategori
  getByKategori(kategori) {
    try {
      const berita = this.getAll();
      return berita.filter(item => item.kategori === kategori);
    } catch (error) {
      console.error('Error getting berita by kategori:', error);
      return [];
    }
  }
}

// Export singleton instance
const beritaService = new BeritaService();
export default beritaService;