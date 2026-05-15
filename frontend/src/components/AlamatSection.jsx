function AlamatSection() {
  const contactInfo = {
    alamat:
      "Jl. Surotokunto No.110, Warungbambu, Kec. Karawang Tim., Karawang, Jawa Barat 41371",
    telepon: "0822 2080 3434",
    email: "lp2akarawang@gmail.com",
    jam_operasional:
      "Selasa - Kamis: 08:00 - 14:30 | Sabtu: 08:00 - 11:30 WIB",
  };

  const socialLinks = [
    {
      name: "Facebook",
      icon: "facebook",
      url: "https://www.facebook.com/lapas.karawang/",
    },
    {
      name: "Instagram",
      icon: "instagram",
      url: "https://www.instagram.com/lapaskarawang/reels/",
    },
    {
      name: "YouTube",
      icon: "youtube",
      url: "https://www.youtube.com/@lapaskarawang7543",
    },
  ];

  const getSocialIcon = (iconName) => {
    const icons = {
      facebook: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      instagram: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
      youtube: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    };
    return icons[iconName] || null;
  };

  return (
    <section id="alamat" className="bg-slate-900 text-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Kontak */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3">Kontak Kami</h3>
            <div className="space-y-2 text-sm text-slate-300">
              <p>
                <strong>Alamat:</strong> {contactInfo.alamat}
              </p>
              <p>
                <strong>Telepon:</strong> {contactInfo.telepon}
              </p>
              <p>
                <strong>Email:</strong>{" "}
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="hover:text-white"
                >
                  {contactInfo.email}
                </a>
              </p>
              <p>
                <strong>Jam:</strong> {contactInfo.jam_operasional}
              </p>
            </div>
          </div>

          {/* Lokasi */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3">Lokasi Kami</h3>
            <div className="overflow-hidden rounded-lg border border-slate-700 bg-slate-800 h-48">
              <iframe
                title="Peta Lokasi LAPAS Karawang"
                src={`https://www.google.com/maps?q=${encodeURIComponent(contactInfo.alamat)}&output=embed`}
                className="w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Media Sosial */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3">Ikuti Kami</h3>
            <p className="text-sm text-slate-300 mb-4">
              Terhubung dengan kami di media sosial untuk informasi terbaru.
            </p>
            <div className="flex gap-3 mb-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                  title={social.name}
                  rel="noopener noreferrer"
                >
                  {getSocialIcon(social.icon)}
                </a>
              ))}
            </div>
            <div className="w-full h-40 gap-4 rounded-lg">
              <p className="font-semibold">Scan Me or Click Me</p>
              <a
                href="https://star-survei3a.kemenimipas.go.id/ly/kInMQzVh"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/images/qr-scan.webp"
                  alt="QR Code"
                  className="w-32 h-32 object-cover cursor-pointer"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-4 text-center text-slate-500 text-xs">
          © {new Date().getFullYear()} Lembaga Pemasyarakatan Kelas IIA
          Karawang. All rights reserved.
        </div>
      </div>
    </section>
  );
}

export default AlamatSection;
