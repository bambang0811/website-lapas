import { useState, useEffect, useCallback } from "react";
import authService from "../services/authService";
import beritaService from "../services/beritaService";
import LoginForm from "../components/admin/LoginForm";
import AdminLayout from "../components/admin/AdminLayout";
import BeritaManager from "../components/admin/BeritaManager";
import StrukturManager from "../components/admin/StrukturManager";
import PejabatManager from "../components/admin/PejabatManager";
import PopupManager from "../components/admin/PopupManager";
import Card from "../components/common/Card";

function Admin() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    totalBerita: 0,
    publishedBerita: 0,
    draftBerita: 0,
    recentBerita: [],
  });

  const loadDashboardData = useCallback(async () => {
    try {
      const allBerita = await beritaService.getAll();
      const publishedBerita = await beritaService.getPublished();

      setStats({
        totalBerita: allBerita.length,
        publishedBerita: publishedBerita.length,
        draftBerita: allBerita.length - publishedBerita.length,
        recentBerita: allBerita.slice(0, 5),
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  }, []);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = () => {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadDashboardData();
    }
  }, [user, loadDashboardData]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <AdminLayout
      user={user}
      onLogout={handleLogout}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-heading font-bold text-gray-900">
              Dashboard Admin
            </h1>
            <p className="text-gray-600">
              Kelola konten website LAPAS Karawang
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-primary-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Berita
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.totalBerita}
                  </p>
                  <p className="text-xs text-gray-500">
                    {stats.publishedBerita} published
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Berita Published
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.publishedBerita}
                  </p>
                  <p className="text-xs text-green-600">Aktif di website</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Draft Berita
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.draftBerita}
                  </p>
                  <p className="text-xs text-yellow-600">Perlu review</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    System Status
                  </p>
                  <p className="text-2xl font-bold text-green-600">Online</p>
                  <p className="text-xs text-gray-500">Semua sistem normal</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Actions & Recent Berita */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <Card className="p-6">
              <h2 className="text-lg font-heading font-semibold text-gray-900 mb-4">
                Aksi Cepat
              </h2>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => setActiveTab("berita")}
                  className="p-4 bg-primary-50 hover:bg-primary-100 rounded-lg border border-primary-200 transition-colors duration-200 text-left"
                >
                  <div className="flex items-center">
                    <svg
                      className="w-8 h-8 text-primary-600 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-primary-700">
                        Tambah Berita Baru
                      </p>
                      <p className="text-xs text-primary-600">
                        Buat konten berita terbaru
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => window.open("/", "_blank")}
                  className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors duration-200 text-left"
                >
                  <div className="flex items-center">
                    <svg
                      className="w-8 h-8 text-blue-600 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-blue-700">
                        Lihat Website
                      </p>
                      <p className="text-xs text-blue-600">
                        Preview halaman publik
                      </p>
                    </div>
                  </div>
                </button>

                <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors duration-200 text-left">
                  <div className="flex items-center">
                    <svg
                      className="w-8 h-8 text-green-600 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-green-700">
                        Lihat Statistik
                      </p>
                      <p className="text-xs text-green-600">
                        Analisis performa website
                      </p>
                    </div>
                  </div>
                </button>

                <button className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors duration-200 text-left">
                  <div className="flex items-center">
                    <svg
                      className="w-8 h-8 text-purple-600 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-purple-700">
                        Pengaturan
                      </p>
                      <p className="text-xs text-purple-600">
                        Konfigurasi sistem
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </Card>

            {/* Recent Berita */}
            <Card className="p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-heading font-semibold text-gray-900">
                  Berita Terbaru
                </h2>
                <button
                  onClick={() => setActiveTab("berita")}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Kelola Semua →
                </button>
              </div>

              <div className="space-y-4">
                {stats.recentBerita.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <svg
                      className="w-12 h-12 mx-auto mb-3 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                      />
                    </svg>
                    <p>Belum ada berita</p>
                    <p className="text-sm">
                      Klik "Tambah Berita Baru" untuk memulai
                    </p>
                  </div>
                ) : (
                  stats.recentBerita.map((berita) => (
                    <div
                      key={berita.id}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {berita.gambar ? (
                        <img
                          src={berita.gambar}
                          alt={berita.judul}
                          className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-6 h-6 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {berita.judul}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {berita.tanggal} • {berita.kategori}
                        </p>
                        <div className="flex items-center mt-1">
                          <span
                            className={`inline-block px-2 py-1 text-xs rounded-full ${
                              berita.status === "published"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {berita.status === "published"
                              ? "Published"
                              : "Draft"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* Activity Timeline */}
          <Card className="p-6">
            <h2 className="text-lg font-heading font-semibold text-gray-900 mb-4">
              Aktivitas Terbaru
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">
                    Dashboard admin berhasil dimuat
                  </p>
                  <span className="text-xs text-gray-400">Baru saja</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Admin login ke sistem</p>
                  <span className="text-xs text-gray-400">
                    5 menit yang lalu
                  </span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Sistem siap digunakan</p>
                  <span className="text-xs text-gray-400">Hari ini</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
      {activeTab === "berita" && <BeritaManager />}
      {activeTab === "struktur" && <StrukturManager />}
      {activeTab === "pejabat" && <PejabatManager />}
      {activeTab === "popup" && <PopupManager />}
    </AdminLayout>
  );
}

export default Admin;
