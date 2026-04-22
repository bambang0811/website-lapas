function SurveiSection() {
  return (
    <section className="section-padding bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold mb-4">
              Survei Kepuasan Masyarakat
            </h2>
            <div className="h-1 w-16 bg-blue-600 rounded-full mb-4" />
            <p className="text-lg text-slate-700 mb-6 leading-relaxed">
              Bantu kami memberikan layanan terbaik dengan mengisi survei kepuasan masyarakat. Masukan dan saran Anda sangat berharga untuk peningkatan kualitas pelayanan LAPAS Kelas IIA Karawang.
            </p>
            <div className="space-y-3 text-slate-700">
              <p className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">✓</span>
                Diperlukan waktu hanya 5 menit
              </p>
              <p className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">✓</span>
                Jawaban Anda dijaga kerahasiaannya
              </p>
              <p className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">✓</span>
                Terima kasih atas kontribusi Anda
              </p>
            </div>
          </div>

          <div className="flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
              <img
                src="/images/survey/qr-survei.png"
                alt="QR Code Survei Kepuasan Masyarakat"
                className="w-64 h-64 object-contain"
              />
              <p className="text-center text-slate-700 text-sm font-semibold mt-4">
                Scan QR Code untuk mengisi survei
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SurveiSection;
