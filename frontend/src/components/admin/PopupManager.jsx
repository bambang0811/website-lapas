import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import popupService from "../../services/popupService";
import Button from "../common/Button";
import Card from "../common/Card";

const defaultForm = {
  image: null,
  active: true,
};

function PopupManager() {
  const [popups, setPopups] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [selectedId, setSelectedId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const [saving, setSaving] = useState(false);

  const fileInputRef = useRef(null);

  const BACKEND_URL = (
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:5000/api"
  ).replace(/\/api\/?$/, "");

  const loadPopups = useCallback(async () => {
    try {
      setError("");

      const data = await popupService.getAll();

      setPopups(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("loadPopups error:", err);

      setError(
        err.message || "Gagal memuat data popup."
      );
    }
  }, []);

  useEffect(() => {
    loadPopups();
  }, [loadPopups]);

  const getImageSrc = (imageUrl) => {
    if (!imageUrl) {
      return "";
    }

    if (
      imageUrl.startsWith("http://") ||
      imageUrl.startsWith("https://") ||
      imageUrl.startsWith("data:") ||
      imageUrl.startsWith("blob:")
    ) {
      return imageUrl;
    }

    return `${BACKEND_URL}${
      imageUrl.startsWith("/") ? "" : "/"
    }${imageUrl}`;
  };

  const handleImageChange = (e) => {
    setError("");
    setMessage("");

    const file = e.target.files?.[0];

    if (!file) {
      setForm((prev) => ({
        ...prev,
        image: null,
      }));

      setPreview("");

      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar.");

      e.target.value = "";

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Ukuran gambar maksimal 5MB."
      );

      e.target.value = "";

      return;
    }

    setForm((prev) => ({
      ...prev,
      image: file,
    }));

    const previewUrl =
      URL.createObjectURL(file);

    setPreview(previewUrl);
  };

  const handleSelect = (popup) => {
    setSelectedId(popup.id);

    setForm({
      image: null,
      active:
        popup.active === 1 ||
        popup.active === true,
    });

    setPreview(
      getImageSrc(popup.image_url)
    );

    setMessage("");
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleChange = (e) => {
    const {
      name,
      type,
      checked,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const resetForm = () => {
    setForm({
      ...defaultForm,
    });

    setSelectedId(null);
    setPreview("");
    setError("");
    setMessage("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!form.image && !selectedId) {
      setError(
        "Pilih gambar popup terlebih dahulu."
      );

      return;
    }

    const payload = new FormData();

    if (form.image instanceof File) {
      payload.append(
        "image",
        form.image
      );
    }

    payload.append(
      "active",
      form.active ? "1" : "0"
    );

    console.log(
      "=== SUBMIT POPUP ==="
    );

    console.log(
      "Backend:",
      BACKEND_URL
    );

    console.log(
      "Selected ID:",
      selectedId
    );

    console.log(
      "File:",
      form.image
    );

    setSaving(true);

    try {
      let result;

      if (selectedId) {
        result =
          await popupService.update(
            selectedId,
            payload
          );

        setMessage(
          "Popup berhasil diperbarui."
        );
      } else {
        result =
          await popupService.create(
            payload
          );

        setMessage(
          "Popup berhasil dibuat."
        );
      }

      console.log(
        "POPUP RESPONSE:",
        result
      );

      resetForm();

      await loadPopups();
    } catch (err) {
      console.error(
        "SAVE POPUP ERROR:",
        err
      );

      setError(
        err.message ||
          "Terjadi kesalahan saat menyimpan popup."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Yakin menghapus popup ini?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await popupService.delete(id);

      setMessage(
        "Popup berhasil dihapus."
      );

      if (selectedId === id) {
        resetForm();
      }

      await loadPopups();
    } catch (err) {
      console.error(
        "DELETE POPUP ERROR:",
        err
      );

      setError(
        err.message ||
          "Gagal menghapus popup."
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-gray-900">
          Kelola Popup Landing Page
        </h1>

        <p className="text-gray-600">
          Upload gambar popup yang tampil di
          halaman utama untuk pengunjung baru.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Form Popup
          </h2>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
              {message}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Gambar Popup
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={saving}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
            </div>

            {preview && (
              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
                <img
                  src={preview}
                  alt="Preview popup"
                  className="w-full object-contain"
                />
              </div>
            )}

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
                disabled={saving}
                id="activePopup"
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />

              <label
                htmlFor="activePopup"
                className="text-sm text-gray-700"
              >
                Aktifkan popup untuk pengunjung baru
              </label>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                type="submit"
                disabled={saving}
              >
                {saving
                  ? "Menyimpan..."
                  : selectedId
                    ? "Perbarui"
                    : "Simpan"}
              </Button>

              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Batal
              </button>
            </div>
          </form>
        </Card>

        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            Daftar Popup
          </h2>

          <div className="space-y-3">
            {popups.length === 0 && (
              <p className="text-sm text-gray-500">
                Belum ada popup yang tersimpan.
              </p>
            )}

            {popups.map((popup) => (
              <div
                key={popup.id}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-2">
                    <p className="font-semibold text-gray-900">
                      Popup #{popup.id}
                    </p>

                    <p className="text-sm text-gray-600">
                      Status:{" "}
                      {popup.active
                        ? "Aktif"
                        : "Nonaktif"}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleSelect(popup)
                      }
                      className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          popup.id
                        )
                      }
                      className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                      Hapus
                    </button>
                  </div>
                </div>

                {popup.image_url && (
                  <img
                    src={getImageSrc(
                      popup.image_url
                    )}
                    alt={`Popup ${popup.id}`}
                    className="mt-4 h-40 w-full rounded-2xl object-contain"
                  />
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default PopupManager;