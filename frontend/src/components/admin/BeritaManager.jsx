import { useEffect, useState, useRef, useCallback } from "react";
import beritaService from "../../services/beritaService";
import Button from "../common/Button";
import Card from "../common/Card";

const initialForm = {
  judul: "",
  excerpt: "",
  konten: "",
  kategori: "",
  gambar: "",
  video: "",
  tanggal: "",
  bulan: "",
  tahun: "",
  status: "published",
};

function BeritaManager() {
  const [beritaList, setBeritaList] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoPreview, setVideoPreview] = useState("");
  const [isUploading] = useState(false);
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL || "https://lapas-backend.onrender.com/api";

  const loadBeritaData = useCallback(async () => {
    try {
      const data = await beritaService.getAll();
      setBeritaList(data);
    } catch (error) {
      console.error("Error loading berita:", error);
      setError("Gagal memuat data berita");
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadBeritaData();
  }, [loadBeritaData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const buildPublishDate = useCallback((data) => {
    const day = Number(data.tanggal);
    const month = Number(data.bulan);
    const year = Number(data.tahun);

    if (!day || !month || !year) {
      return "";
    }

    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }, []);

  const parseImageList = useCallback((imageValue) => {
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
      // Fallback below if value is not JSON.
    }

    if (imageValue.includes(",")) {
      return imageValue
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return [imageValue];
  }, []);

  const handleSubmit = async (e, forcedStatus = null) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (
      !formData.judul ||
      !formData.excerpt ||
      !formData.konten ||
      !formData.kategori
    ) {
      setError("Semua field yang ditandai wajib diisi.");
      return;
    }

    const submitData = forcedStatus
      ? { ...formData, status: forcedStatus }
      : formData;

    try {
      const payload = new FormData();
      const manualPublishDate = buildPublishDate(submitData);

      payload.append("judul", submitData.judul);
      payload.append("excerpt", submitData.excerpt);
      payload.append("konten", submitData.konten);
      payload.append("kategori", submitData.kategori);
      payload.append("status", submitData.status || "draft");
      payload.append("penulis", submitData.penulis || "Admin LAPAS");
      if (manualPublishDate) {
        payload.append("tanggal_publikasi", manualPublishDate);
      }

      if (Array.isArray(submitData.gambar)) {
        submitData.gambar.forEach((file) => {
          if (file instanceof File) {
            payload.append("gambar", file);
          }
        });
      } else if (submitData.gambar instanceof File) {
        payload.append("gambar", submitData.gambar);
      } else if (typeof submitData.gambar === "string" && submitData.gambar !== "") {
        const images = parseImageList(submitData.gambar);
        if (images.length > 1) {
          payload.append("gambar_url", JSON.stringify(images));
        } else {
          payload.append("gambar_url", images[0]);
        }
      }

      if (submitData.video instanceof File) {
        payload.append("video", submitData.video);
      } else if (typeof submitData.video === "string" && submitData.video !== "") {
        payload.append("video_url", submitData.video);
      }

      if (isEditing && selectedId !== null) {
        await beritaService.update(selectedId, payload);
        setMessage("Berita berhasil diperbarui.");
      } else {
        await beritaService.add(payload);
        setMessage("Berita baru berhasil ditambahkan.");
      }
      setFormData(initialForm);
      setIsEditing(false);
      setSelectedId(null);
      setImagePreviews([]);
      setVideoPreview("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      if (videoInputRef.current) {
        videoInputRef.current.value = "";
      }
      await loadBeritaData();
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat menyimpan berita.");
    }
  };

  const handleEdit = (item) => {
    const existingImages = parseImageList(item.gambar_url || item.gambar || "");
    const publishDate = item.tanggal_publikasi ? new Date(item.tanggal_publikasi) : null;

    setFormData({
      judul: item.judul,
      excerpt: item.excerpt,
      konten: item.konten,
      kategori: item.kategori,
      gambar: existingImages,
      video: item.video_url || "",
      tanggal: publishDate ? String(publishDate.getDate()) : "",
      bulan: publishDate ? String(publishDate.getMonth() + 1) : "",
      tahun: publishDate ? String(publishDate.getFullYear()) : "",
      status: item.status || "published",
      penulis: item.penulis || "Admin LAPAS",
      tanggal_publikasi: item.tanggal_publikasi || "",
    });
    setSelectedId(item.id);
    setIsEditing(true);
    setMessage("");
    setError("");
    setImagePreviews(
      existingImages.map((image) =>
        image.startsWith("http") || image.startsWith("data:")
          ? image
          : `${API_URL}${image.startsWith("/") ? "" : "/"}${image}`,
      ),
    );
    setVideoPreview(
      item.video_url
        ? item.video_url.startsWith("http") || item.video_url.startsWith("data:")
          ? item.video_url
          : `${API_URL}${item.video_url.startsWith("/") ? "" : "/"}${item.video_url}`
        : "",
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus berita ini?")) return;
    try {
      await beritaService.delete(id);
      setMessage("Berita berhasil dihapus.");
      await loadBeritaData();
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat menghapus berita.");
    }
  };

  const handleCancel = () => {
    setFormData(initialForm);
    setIsEditing(false);
    setSelectedId(null);
    setError("");
    setMessage("");
    setImagePreviews([]);
    setVideoPreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) {
      setImagePreviews([]);
      setFormData({ ...formData, gambar: "" });
      return;
    }

    const validFiles = files.filter((file) => file.type.startsWith("image/"));
    if (validFiles.length !== files.length) {
      setError("File harus berupa gambar (JPG, PNG, GIF, dll)");
      return;
    }

    const oversized = validFiles.find((file) => file.size > 5 * 1024 * 1024);
    if (oversized) {
      setError("Ukuran file maksimal 5MB");
      return;
    }

    setError("");
    setFormData({ ...formData, gambar: validFiles });
    setImagePreviews(validFiles.map((file) => URL.createObjectURL(file)));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setVideoPreview("");
      setFormData({ ...formData, video: "" });
      return;
    }

    if (!file.type.startsWith("video/")) {
      setError("File video tidak valid");
      return;
    }

    if (file.size > 30 * 1024 * 1024) {
      setError("Ukuran video maksimal 30MB");
      return;
    }

    setError("");
    setFormData({ ...formData, video: file });
    setVideoPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImagePreviews([]);
    setFormData({ ...formData, gambar: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeVideo = () => {
    setVideoPreview("");
    setFormData({ ...formData, video: "" });
    if (videoInputRef.current) {
      videoInputRef.current.value = "";
    }
  };

  const getImageUrl = (gambar) => {
    if (!gambar) return null;

    const imageList = parseImageList(gambar);
    const firstImage = imageList[0];
    if (!firstImage) return null;
    if (firstImage.startsWith("data:") || firstImage.startsWith("http")) return firstImage;

    const normalized = firstImage.replace(/\\/g, "/");
    if (normalized.startsWith("/uploads/")) return `${API_URL}${normalized}`;
    if (normalized.startsWith("uploads/")) return `${API_URL}/${normalized}`;
    if (normalized.startsWith("/")) return `${API_URL}${normalized}`;
    if (normalized.includes("/")) return `${API_URL}/${normalized}`;
    return `${API_URL}/uploads/berita/${normalized}`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-1">
          <h2 className="text-xl font-heading font-semibold text-gray-900 mb-4">
            {isEditing ? "Edit Berita" : "Tambah Berita"}
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Judul
              </label>
              <input
                name="judul"
                value={formData.judul}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt
              </label>
              <textarea
                name="excerpt"
                rows={3}
                value={formData.excerpt}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Konten
              </label>
              <textarea
                name="konten"
                rows={4}
                value={formData.konten}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
              </label>
              <input
                name="kategori"
                value={formData.kategori}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Publikasi
              </label>
              <div className="grid grid-cols-3 gap-3">
                <input
                  type="number"
                  name="tanggal"
                  min="1"
                  max="31"
                  placeholder="Tanggal"
                  value={formData.tanggal}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="number"
                  name="bulan"
                  min="1"
                  max="12"
                  placeholder="Bulan"
                  value={formData.bulan}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="number"
                  name="tahun"
                  min="2000"
                  placeholder="Tahun"
                  value={formData.tahun}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gambar Berita
              </label>
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
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
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 relative">
                    {imagePreviews.map((preview, index) => (
                      <div key={`${preview}-${index}`} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full aspect-[4/5] object-cover rounded-lg border border-gray-300"
                        />
                      </div>
                    ))}
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
                  Format: JPG, PNG, GIF. Maksimal 5MB per file. Rekomendasi: 1080x1350px (rasio 4:5). Dapat upload beberapa foto sekaligus.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Video Berita
              </label>
              <div className="space-y-3">
                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  disabled={isUploading}
                />
                {videoPreview && (
                  <div className="relative">
                    <video
                      src={videoPreview}
                      controls
                      autoPlay
                      muted
                      className="w-full aspect-[4/5] object-cover rounded-lg border border-gray-300 bg-slate-200"
                    />
                    <button
                      type="button"
                      onClick={removeVideo}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                )}
                <p className="text-xs text-gray-500">
                  Format: MP4, WebM, MOV. Maksimal 30MB.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  onClick={(e) => handleSubmit(e, "published")}
                  className="flex-1"
                  disabled={isUploading}
                >
                  {isEditing ? "Update & Publish" : "Publish Berita"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => handleSubmit(e, "draft")}
                  className="flex-1"
                  disabled={isUploading}
                >
                  {isEditing ? "Update Draft" : "Save as Draft"}
                </Button>
              </div>
              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="w-full"
                >
                  Batal
                </Button>
              )}
            </div>
          </form>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-heading font-semibold text-gray-900">
                Daftar Berita
              </h2>
              <p className="text-sm text-gray-600">
                Kelola semua berita yang tersimpan di local storage.
              </p>
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
                          className="w-20 aspect-[4/5] object-cover rounded-lg border border-gray-200 flex-shrink-0"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.judul}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {item.tanggal} • {item.kategori}
                        </p>
                        <p className="mt-2 text-gray-700 line-clamp-2">
                          {item.excerpt}
                        </p>
                        <span
                          className={`inline-block px-2 py-1 text-xs rounded-full mt-2 ${
                            item.status === "published"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {item.status === "published" ? "Published" : "Draft"}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                      >
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
