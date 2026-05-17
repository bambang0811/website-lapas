import { useEffect, useState } from "react";
import popupService from "../services/popupService";

const POPUP_CLOSE_KEY = "landing_popup_closed_at";
const POPUP_TIMEOUT_MINUTES = 10;
const POPUP_TIMEOUT_MS = POPUP_TIMEOUT_MINUTES * 60 * 1000;

function LandingPopup() {
  const [popup, setPopup] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const closedAt = Number(localStorage.getItem(POPUP_CLOSE_KEY)) || 0;
    const now = Date.now();

    if (closedAt && now - closedAt < POPUP_TIMEOUT_MS) {
      setLoading(false);
      return;
    }

    const fetchPopup = async () => {
      try {
        const activePopup = await popupService.getActive();
        if (activePopup && activePopup.image_url) {
          setPopup(activePopup);
          setVisible(true);
        }
      } catch (error) {
        console.error("Error loading landing popup:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopup();
  }, []);

  const handleClose = () => {
    setVisible(false);
    localStorage.setItem(POPUP_CLOSE_KEY, String(Date.now()));
  };

  if (loading || !visible || !popup?.image_url) {
    return null;
  }

 const API_URL = import.meta.env.VITE_API_URL;

const imageSrc = popup.image_url
  ? popup.image_url.startsWith("http")
    ? popup.image_url
    : `${API_URL}${popup.image_url}`
  : "";
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4 py-8">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />
      <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-[28px] border border-white/80 bg-white shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/90 text-slate-100 shadow hover:bg-black"
          aria-label="Close popup"
        >
          <span className="text-2xl leading-none">×</span>
        </button>
        <img
          src={imageSrc}
          alt="Pengumuman"
          className="w-full max-h-[85vh] object-contain"
        />
      </div>
    </div>
  );
}

export default LandingPopup;
