import { useState, useCallback, useEffect, useMemo } from "react";
import { useBerita } from "../hooks/useBerita";
import Card from "./common/Card";
import Button from "./common/Button";

function BeritaSection() {
  const { berita, loading, error } = useBerita();
  const [selectedBerita, setSelectedBerita] = useState(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const API_URL =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.VITE_API_BASE_URL || "https://lapas-backend.onrender.com/api")
      .replace(/\/api\/?$/, "");

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  const truncateText = useCallback((text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  }, []);

  const formatKonten = useCallback((konten) => {
    if (!konten) return null;

    if (/<[a-z][\s\S]*>/i.test(konten)) {
      return (
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: konten }}
        />
      );
    }

    const paragraphs = konten
      .replace(/\r\n/g, "\n")
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);

    return (
      <div className="prose max-w-none">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="mb-4 text-slate-700 leading-relaxed">
            {paragraph.split("\n").map((line, lineIndex) => (
              <span key={lineIndex}>
                {line}
                {lineIndex < paragraph.split("\n").length - 1 ? <br /> : null}
              </span>
            ))}
          </p>
        ))}
      </div>
    );
  }, []);

  const normalizeImageList = useCallback((imageValue) => {
    if (!imageValue) return [];
    if (Array.isArray(imageValue)) {
      return imageValue.filter(Boolean);
    }

    if (typeof imageValue !== "string") return [];

    try {
      const parsed = JSON.parse(imageValue);
      if (Array.isArray(parsed)) {
        return parsed.filter(Boolean);
      }
    } catch {
      // Ignore invalid JSON and fallback to single value.
    }

    if (imageValue.includes(",")) {
      return imageValue
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return [imageValue];
  }, []);

  const getImageUrlList = useCallback(
    (imageValue) => {
      const images = normalizeImageList(imageValue);
      return images
        .map((imagePath) => {
          if (!imagePath) return "";
          if (imagePath.startsWith("http") || imagePath.startsWith("data:")) {
            return imagePath;
          }
          return `${API_URL}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
        })
        .filter(Boolean);
    },
    [API_URL, normalizeImageList],
  );

  const getImageUrl = useCallback(
    (imageValue) => getImageUrlList(imageValue)[0] || "/images/placeholder-news.svg",
    [getImageUrlList],
  );

  const handleShare = useCallback(
    (item) => {
      const pageUrl = `${window.location.origin}/#berita`;
      const imageUrl = getImageUrl(item.gambar_url || item.gambar);
      const shareText = `${item.judul}\n\n${item.excerpt || ""}\n\n${pageUrl}${imageUrl ? `\n\n${imageUrl}` : ""}`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(whatsappUrl, "_blank");
    },
    [getImageUrl],
  );

  const selectedImages = useMemo(
    () => getImageUrlList(selectedBerita?.gambar_url || selectedBerita?.gambar),
    [selectedBerita, getImageUrlList],
  );

  useEffect(() => {
    if (!selectedBerita || selectedImages.length <= 1) {
      setActiveSlideIndex(0);
      return;
    }

    const timer = setInterval(() => {
      setActiveSlideIndex((prev) => (prev + 1) % selectedImages.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [selectedBerita, selectedImages]);

  const handleBeritaLainnya = useCallback(() => {
    setSelectedBerita(null);
    window.location.hash = "#berita";
  }, []);

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
              Informasi terbaru tentang kegiatan dan program.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mb-20">
            {berita.slice(0, 6).map((item, index) => {
              const itemImages = getImageUrlList(item.gambar_url || item.gambar);
              const coverImage = itemImages[0] || "/images/placeholder-news.svg";

              return (
                <Card key={item.id} hover shadow="md" className="h-full">
                  <div className="aspect-[4/5] w-full overflow-hidden bg-slate-200">
                    {itemImages.length > 0 ? (
                      <img
                        src={coverImage}
                        alt={item.judul}
                        className="h-full w-full object-cover"
                        loading={index < 3 ? "eager" : "lazy"}
                        onError={(e) => {
                          e.currentTarget.src = "/images/placeholder-news.svg";
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
                    <time>{formatDate(item.tanggal_publikasi)}</time>
                  </div>

                  <h3 className="text-xl font-semibold text-slate-900 mb-3">
                    {item.judul}
                  </h3>

                  <p className="text-slate-600 text-sm mb-6">
                    {truncateText(item.excerpt, 120)}
                  </p>

                    <Button
                      size="sm"
                      variant="primary"
                      className="w-full"
                      onClick={() => setSelectedBerita(item)}
                    >
                      Baca Selengkapnya
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {berita.length === 0 && (
            <div className="text-center py-24">
              <h3 className="text-3xl font-bold text-slate-900 mb-4">
                Belum Ada Berita
              </h3>
              <p className="text-slate-600 text-lg">
                Berita akan segera hadir.
              </p>
            </div>
          )}
        </div>
      </section>

      {selectedBerita && (
        <div
          className="fixed inset-0 z-50 bg-black/40 p-4 overflow-y-auto"
          onClick={(e) =>
            e.target === e.currentTarget && setSelectedBerita(null)
          }
        >
          <div className="flex min-h-screen items-center justify-center">
            <div className="w-full max-w-4xl rounded-2xl bg-white shadow-xl overflow-hidden">
              <div className="flex items-center justify-between border-b p-6">
                <h3 className="text-2xl font-bold">{selectedBerita.judul}</h3>
                <button onClick={() => setSelectedBerita(null)}>Tutup</button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                  <span className="rounded-full bg-slate-100 px-3 py-1">
                    {selectedBerita.kategori}
                  </span>
                  <span>•</span>
                  <time>{formatDate(selectedBerita.tanggal_publikasi)}</time>
                  <span>•</span>
                  <span>{selectedBerita.penulis}</span>
                </div>

                {selectedImages.length > 0 && (
                  <div className="space-y-3">
                    <div className="relative overflow-hidden rounded-lg">
                      <img
                        src={selectedImages[activeSlideIndex]}
                        alt={selectedBerita.judul}
                        className="w-full aspect-[4/5] object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = "/images/placeholder-news.svg";
                        }}
                      />

                      {selectedImages.length > 1 && (
                        <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
                          {selectedImages.map((_, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => setActiveSlideIndex(index)}
                              className={`h-2.5 w-2.5 rounded-full transition ${
                                index === activeSlideIndex
                                  ? "bg-white shadow-md"
                                  : "bg-white/60"
                              }`}
                              aria-label={`Pilih foto ${index + 1}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {formatKonten(selectedBerita.konten)}

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    className="w-full"
                    onClick={() => handleShare(selectedBerita)}
                  >
                    Bagikan
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={handleBeritaLainnya}
                  >
                    Berita Lainnya
                  </Button>
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
