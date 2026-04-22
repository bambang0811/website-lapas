import { useEffect, useState } from 'react';
import profileService from '../../services/profileService';
import Card from '../common/Card';
import Button from '../common/Button';

function StrukturManager() {
  const [struktur, setStruktur] = useState({ heading: '', description: '', image: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const profile = profileService.getProfile();
    setStruktur(profile.struktur || { heading: '', description: '', image: '' });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStruktur((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!struktur.heading.trim() || !struktur.description.trim()) {
      setError('Judul dan deskripsi struktur wajib diisi.');
      return;
    }

    try {
      profileService.updateStruktur(struktur);
      setMessage('Struktur organisasi berhasil disimpan.');
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan saat menyimpan struktur.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-gray-900">Kelola Struktur Organisasi</h1>
        <p className="text-gray-600">Edit informasi struktur organisasi yang ditampilkan di halaman profil.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Form Edit Struktur</h2>

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
              <label className="block text-sm font-medium text-gray-700 mb-2">Judul Struktur</label>
              <input
                name="heading"
                value={struktur.heading}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Struktur</label>
              <textarea
                name="description"
                rows={4}
                value={struktur.description}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">URL Gambar Struktur</label>
              <input
                name="image"
                value={struktur.image}
                onChange={handleChange}
                placeholder="/images/profile/struktur.svg"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="mt-2 text-xs text-gray-500">Masukkan path gambar dari folder public, misalnya /images/profile/struktur.svg</p>
            </div>

            <div className="flex items-center gap-3">
              <Button type="submit">Simpan Struktur</Button>
            </div>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Preview</h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{struktur.heading || 'Judul Struktur'}</h3>
              <p>{struktur.description || 'Deskripsi struktur organisasi akan tampil di sini.'}</p>
            </div>
            {struktur.image && (
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <img src={struktur.image} alt="Preview Struktur" className="w-full h-auto object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default StrukturManager;
