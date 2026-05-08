import { useEffect, useState, useRef, useCallback } from 'react';
import beritaService from '../../services/beritaService';
import Button from '../common/Button';
import Card from '../common/Card';

const initialForm = {
  judul: '',
  excerpt: '',
  konten: '',
  kategori: '',
  gambar: '',
  status: 'published'
};

function BeritaManager() {
  const [beritaList, setBeritaList] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const loadBeritaData = useCallback(async () => {
    try {
      const data = await beritaService.getAll();
      setBeritaList(data);
    } catch (error) {
      console.error('Error loading berita:', error);
      setError('Gagal memuat data berita');
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadBeritaData();
  }, [loadBeritaData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e, forcedStatus = null) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!formData.judul || !formData.excerpt || !formData.konten || !formData.kategori) {
      setError('Semua field yang ditandai wajib diisi.');
      return;
    }

    // Use forced status if provided, otherwise use form status
    const submitData = forcedStatus ? { ...formData, status: forcedStatus } : formData;

    try {
      const payload = new FormData();
      payload.append('judul', submitData.judul);
      payload.append('excerpt', submitData.excerpt);
      payload.append('konten', submitData.konten);
      payload.append('kategori', submitData.kategori);
      payload.append('status', submitData.status || 'draft');
      payload.append('penulis', submitData.penulis || 'Admin LAPAS');
      if (submitData.tanggal_publikasi) {
        payload.append('tanggal_publikasi', submitData.tanggal_publikasi);
      }

      if (submitData.gambar instanceof File) {
        payload.append('gambar', submitData.gambar);
      } else if (typeof submitData.gambar === 'string' && submitData.gambar !== '') {
        payload.append('gambar_url', submitData.gambar);
      }

      if (isEditing && selectedId !== null) {
        await beritaService.update(selectedId, payload);
        setMessage('Berita berhasil diperbarui.');
      } else {
        await beritaService.add(payload);
        setMessage('Berita baru berhasil ditambahkan.');
      }
      setFormData(initialForm);
      setIsEditing(false);
      setSelectedId(null);
      setImagePreview('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      await loadBeritaData();
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan saat menyimpan berita.');
    }
  };

  const handleEdit = (item) => {
    const existingImage = item.gambar_url || item.gambar || '';
    setFormData({
      judul: item.judul,
      excerpt: item.excerpt,
      konten: item.konten,
      kategori: item.kategori,
      gambar: existingImage,
      status: item.status || 'published', // Keep existing status for editing
      penulis: item.penulis || 'Admin LAPAS',
      tanggal_publikasi: item.tanggal_publikasi || ''
    });
    setSelectedId(item.id);
    setIsEditing(true);
    setMessage('');
    setError('');
    setImagePreview(existingImage ? (existingImage.startsWith('http') ? existingImage : `http://localhost:5000${existingImage}`) : '');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus berita ini?')) return;
    try {
      await beritaService.delete(id);
      setMessage('Berita berhasil dihapus.');
      await loadBeritaData();
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan saat menghapus berita.');
    }
  };

  const handleCancel = () => {
    setFormData(initialForm);
    setIsEditing(false);
    setSelectedId(null);
    setError('');
    setMessage('');
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setImagePreview('');
      setFormData({ ...formData, gambar: '' });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar (JPG, PNG, GIF, dll)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal 5MB');
      return;
    }

    setError('');
    setFormData({ ...formData, gambar: file });
    setImagePreview(URL.createObjectURL(file));
  };

  // Remove selected image
  const removeImage = () => {
    setImagePreview('');
    setFormData({ ...formData, gambar: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getImageUrl = (gambar) => {
    if (!gambar) return null;
    if (typeof gambar !== 'string') return gambar;
    if (gambar.startsWith('data:') || gambar.startsWith('http')) return gambar;
    if (gambar.startsWith('/')) return `http://localhost:5000${gambar}`;
    return `http://localhost:5000/${gambar}`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-1">
          <h2 className="text-xl font-heading font-semibold text-gray-900 mb-4">
            {isEditing ? 'Edit Berita' : 'Tambah Berita'}
          </h2>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3">
              {error}
            </div>
          )}
          {message && (
            <div className="mb-4 rounded-lg bg-green-50 border border-green-200 text-green-700 px-4 py-3">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Judul</label>
              <input
                name="judul"
                value={formData.judul}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
              <textarea
                name="excerpt"
                rows={3}
                value={formData.excerpt}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Konten</label>
              <textarea
                name="konten"
                rows={4}
                value={formData.konten}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
              <input
                name="kategori"
                value={formData.kategori}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gambar Berita</label>
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={isUploading}
                />
                {isUploading && (
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500 mr-2"></div>
                    Mengupload gambar...
                  </div>
                )}
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full max-w-sm h-48 object-cover rounded-lg border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  Format: JPG, PNG, GIF. Maksimal 5MB. Rekomendasi: 800x600px
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  onClick={(e) => handleSubmit(e, 'published')}
                  className="flex-1"
                  disabled={isUploading}
                >
                  {isEditing ? 'Update & Publish' : 'Publish Berita'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => handleSubmit(e, 'draft')}
                  className="flex-1"
                  disabled={isUploading}
                >
                  {isEditing ? 'Update Draft' : 'Save as Draft'}
                </Button>
              </div>
              {isEditing && (
                <Button type="button" variant="outline" onClick={handleCancel} className="w-full">
                  Batal
                </Button>
              )}
            </div>
          </form>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-heading font-semibold text-gray-900">Daftar Berita</h2>
              <p className="text-sm text-gray-600">Kelola semua berita yang tersimpan di local storage.</p>
            </div>
          </div>

          <div className="space-y-4">
            {beritaList.length === 0 ? (
              <div className="rounded-lg bg-gray-50 border border-gray-200 p-6 text-gray-600">
                Belum ada berita.
              </div>
            ) : (
              beritaList.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex gap-4">
                      {(item.gambar || item.gambar_url) && (
                        <img
                          src={getImageUrl(item.gambar_url || item.gambar)}
                          alt={item.judul}
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{item.judul}</h3>
                        <p className="text-sm text-gray-500">{item.tanggal} • {item.kategori}</p>
                        <p className="mt-2 text-gray-700 line-clamp-2">{item.excerpt}</p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                          item.status === 'published'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2"> 
                      <Button variant="secondary" size="sm" onClick={() => handleEdit(item)}>
                        Edit
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>
                        Hapus
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default BeritaManager;
