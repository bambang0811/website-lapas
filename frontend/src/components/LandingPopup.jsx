import { useEffect, useState } from "react";
import popupService from "../services/popupService";

const POPUP_CLOSE_KEY = "landing_popup_closed_at";
const POPUP_TIMEOUT_MINUTES = 10;
const POPUP_TIMEOUT_MS = POPUP_TIMEOUT_MINUTES * 60 * 1000;

const BACKEND_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "https://lapas-backend.onrender.com/api"
).replace(/\/api\/?$/, "");

function LandingPopup() {
  const [popup, setPopup] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const closedAt =
      Number(localStorage.getItem(POPUP_CLOSE_KEY)) || 0;

    const now = Date.now();

    if (
      closedAt &&
      now - closedAt < POPUP_TIMEOUT_MS
    ) {
      setLoading(false);
      return;
    }

    const fetchPopup = async () => {
      try {
        const activePopup = await popupService.getActive();

        console.log("ACTIVE POPUP:", activePopup);

        if (
          activePopup &&
          activePopup.image_url
        ) {
          setPopup(activePopup);
          setVisible(true);
        }
      } catch (error) {
        console.error(
          "Error loading landing popup:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPopup();
  }, []);

  const handleClose = () => {
    setVisible(false);

    localStorage.setItem(
      POPUP_CLOSE_KEY,
      String(Date.now())
    );
  };

  if (
    loading ||
    !visible ||
    !popup?.image_url ||
    imageError
  ) {
    return null;
  }

  const imageSrc = popup.image_url.startsWith("http")
    ? popup.image_url
    : `${BACKEND_URL}${
        popup.image_url.startsWith("/")
          ? ""
          : "/"
      }${popup.image_url}`;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">
      <div
        className="absolute inset-0"
        onClick={handleClose}
      />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-3xl items-center justify-center overflow-hidden rounded-3xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={handleClose}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/80 text-2xl text-white shadow-lg transition hover:bg-black"
          aria-label="Tutup popup"
        >
          ×
        </button>

        <img
          src={imageSrc}
          alt="Pengumuman"
          onError={() => {
            console.error(
              "Gagal memuat gambar popup:",
              imageSrc
            );
            setImageError(true);
          }}
          className="max-h-[92vh] w-full object-contain"
        />
      </div>
    </div>
  );
}

export default LandingPopup;