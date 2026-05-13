import React from "react";

export default function WhatsAppFloatingButton() {
  const message = encodeURIComponent(
    "Halo, saya mau melaporkan sesuatu terkait...",
  );

  return (
    <a
      href={`https://wa.me/6282220803434?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50"
    >
      <img
        src="/icons/whatsapp-icon.svg"
        alt="WhatsApp"
        className="size-10 hover:scale-110 transition-transform"
      />
    </a>
  );
}
