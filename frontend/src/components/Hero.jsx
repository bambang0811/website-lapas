import { useEffect, useState } from "react";

// Gambar better taro di C:\lapas-karawang-website\frontend\public\images\carousel
// Lebih enak filenya WEBP biar lebih ringan, tapi kalau mau pakai JPG/PNG juga bisa
const slides = [
  {
    image: "/images/carousel/lapas.webp",
    title: "Lembaga Pemasyarakatan",
    highlight: "Kelas IIA Karawang",
    desc: "Selamat datang di website resmi lapas kelas IIA karawang.",
  },
  {
    image: "/images/carousel/caisim.webp",
    title: "Pembinaan Pertanian",
    highlight: "Warga Binaan",
    desc: "Warga binaan Lapas Kelas IIA Karawang mengikuti pembinaan pertanian melalui kegiatan panen sayur caisim.",
  },
  {
    image: "/images/carousel/sosialisasi.webp",
    title: "Penyelenggaraan Program",
    highlight: "Laundry Bersih",
    desc: "Laundry Bersih Bagi Warga Binaan",
  },
  {
    image: "/images/carousel/panen.webp",
    title: "Panen Raya",
    highlight: "Ketahanan Pangan",
    desc: "ketahanan pangan melalui program pembinaan warga binaan.",
  },
  {
    image: "/images/carousel/panen1.webp",
    title: "Panen Raya",
    highlight: "Ketahanan Pangan",
    desc: "ketahanan pangan melalui program pembinaan warga binaan.",
  },
  {
    image: "/images/carousel/panen2.webp",
    title: "Panen Raya",
    highlight: "Ketahanan Pangan",
    desc: "ketahanan pangan melalui program pembinaan warga binaan.",
  },
];

function Hero() {
  const [index, setIndex] = useState(0);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => {
        if (prevIndex === slides.length - 1) {
          return 0;
        }
        return prevIndex + 1;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [index]);

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${slide.image})` }}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-28">
        <div className="text-center space-y-6 max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
            {slides[index].title}
            <span className="block text-sky-300 mt-2">
              {slides[index].highlight}
            </span>
          </h1>

          <p className="text-slate-200 text-lg">{slides[index].desc}</p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() =>
                document
                  .getElementById("berita")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="btn-primary px-6 py-3"
            >
              Lihat Berita
            </button>

            <button
              onClick={() =>
                document
                  .getElementById("profile")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="btn-secondary px-6 py-3"
            >
              Kenali Kami
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white text-3xl"
      >
        ‹
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white text-3xl"
      >
        ›
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full ${
              i === index ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>

      {/* Wave */}
      <div className="absolute -bottom-2 left-0 right-0 h-[150px] pointer-events-none">
        <svg viewBox="0 0 1440 150" className="w-full h-full">
          <defs>
            <linearGradient id="heroWaveGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#f8fafc" />
            </linearGradient>
          </defs>
          <path
            d="M0,100 C360,180 720,20 1440,100 L1440,150 L0,150 Z"
            fill="url(#heroWaveGradient)"
          />
        </svg>
      </div>
    </section>
  );
}

export default Hero;
