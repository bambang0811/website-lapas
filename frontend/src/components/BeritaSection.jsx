import { useState } from 'react';
import { useBerita } from '../hooks/useBerita';
import Card from './common/Card';
import Button from './common/Button';

function BeritaSection() {
  const { berita, loading, error } = useBerita();
  const [selectedBerita, setSelectedBerita] = useState(null);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <section id="berita" className="section-padding bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Memuat berita...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="berita" className="section-padding bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-red-600 font-semibold mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Coba Lagi
          </Button>
        </div>
      </section>
    );
  }

  return (
    <>
      <section id="berita" className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-slate-900 mb-4">
              Berita Terkini
            </h2>
            <div className="flex justify-center mb-3">
              <div className="h-1 w-16 bg-blue-600 rounded-full"></div>
            </div>
            <p className="text-lg text-slate-700 max-w-2xl mx-auto">
              Informasi terbaru tentang kegiatan, program, dan pengembangan LAPAS Karawang.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-20">
            {berita.slice(0, 6).map((item, index) => (
              <Card key={item.id} hover shadow="md" className="h-full">
                <div className="h-64 bg-slate-200 overflow-hidden">
                  {item.gambar ? (
                    <img
                      src={item.gambar}
                      alt={item.judul}
                      className="w-full h-full object-cover"
                      loading={index < 3 ? 'eager' : 'lazy'}
                      onError={(e) => {
                        e.target.src = '/images/placeholder-news.jpg';
                      }}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-slate-300 text-slate-700">
                      Tidak ada gambar
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                      {item.kategori}
                    </span>
                    <span>•</span>
                    <time>{formatDate(item.tanggal)}</time>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    {item.judul}
                  </h3>
                  <p className="text-slate-600 text-sm mb-6">
                    {truncateText(item.excerpt, 120)}
                  </p>
                  <Button size="sm" variant="primary" className="w-full" onClick={() => setSelectedBerita(item)}>
                    Baca Selengkapnya
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {berita.length === 0 && (
            <div className="text-center py-24">
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Belum Ada Berita</h3>
              <p className="text-slate-600 text-lg">Berita akan segera hadir. Pantau terus untuk update terbaru!</p>
            </div>
          )}
        </div>
      </section>

      {selectedBerita && (
        <div className="fixed inset-0 z-50 bg-black/40 p-4 overflow-y-auto" onClick={(e) => e.target === e.currentTarget && setSelectedBerita(null)}>
          <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-4xl rounded-2xl bg-white shadow-xl overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-200 p-6">
                <h3 className="text-2xl font-bold text-slate-900">{selectedBerita.judul}</h3>
                <button onClick={() => setSelectedBerita(null)} className="text-slate-600 hover:text-slate-900">
                  Tutup
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                  <span className="rounded-full bg-slate-100 px-3 py-1">{selectedBerita.kategori}</span>
                  <span>•</span>
                  <time>{formatDate(selectedBerita.tanggal)}</time>
                  <span>•</span>
                  <span>{selectedBerita.penulis}</span>
                </div>
                {selectedBerita.gambar && (
                  <img src={selectedBerita.gambar} alt={selectedBerita.judul} className="w-full h-80 object-cover rounded-lg" />
                )}
                <div className="prose prose-slate max-w-none text-slate-700">
                  <div dangerouslySetInnerHTML={{ __html: selectedBerita.konten }} />
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button variant="primary" className="w-full">Bagikan Berita</Button>
                  <Button variant="secondary" className="w-full">Berita Lainnya</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BeritaSection;

