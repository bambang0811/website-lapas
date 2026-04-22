function Hero() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 bg-fixed bg-cover bg-center"
        style={{ backgroundImage: `url('/images/GPTempDownload 73.jpg.jpeg')` }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/35 to-slate-950/95" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-28 sm:py-32">
        <div className="space-y-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold tracking-tight text-white">
            Selamat Datang di
            <span className="block text-sky-300 mt-2">Lapas Kelas IIA Karawang</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-200 leading-relaxed">
            Lapas Karawang menghadirkan informasi transparan dan modern untuk masyarakat, dengan
            pengalaman browsing yang nyaman, responsif, dan terfokus pada konten utama.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <button
              onClick={() => document.getElementById('berita')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary px-8 py-3 text-lg"
            >
              Lihat Berita Terbaru
            </button>
            <button
              onClick={() => document.getElementById('profile')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-secondary px-8 py-3 text-lg"
            >
              Kenali Kami
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none" style={{ height: '150px' }}>
        <svg className="relative block w-full h-full" viewBox="0 0 1440 150" preserveAspectRatio="none">
          <defs>
            <linearGradient id="heroWaveGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#f8fafc" />
            </linearGradient>
          </defs>
          <path d="M0,100 C360,180 720,20 1440,100 L1440,150 L0,150 Z" fill="url(#heroWaveGradient)" />
        </svg>
      </div>
    </section>
  );
}

export default Hero;
