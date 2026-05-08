import { useState, useEffect } from 'react';
import Card from './common/Card';
import profileService from '../services/profileService';
import pejabatService from '../services/pejabatService';

function ProfileSection() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profil');
  const [pejabatData, setPejabatData] = useState([]);

  // NEW: pagination state
  const [visibleCount, setVisibleCount] = useState(6);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const profileData = await profileService.getProfile();
        setProfile(profileData);
        setActiveTab(profileData.tabs?.[0]?.id || 'profil');
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    pejabatService
      .getPejabat()
      .then((data) => setPejabatData(data))
      .catch(console.error);
  }, []);

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 6);
      setLoadingMore(false);
    }, 500);
  };

  const getPejabatImage = (foto_url) => {
    if (!foto_url) return 'https://picsum.photos/400/300?blur=2';
    if (foto_url.startsWith('http')) return foto_url;
    if (foto_url.startsWith('/')) return `http://localhost:5000${foto_url}`;
    return `http://localhost:5000/${foto_url}`;
  };

  if (!profile || loading) {
    return (
      <section className="section-padding bg-slate-50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-700">Memuat profil...</p>
        </div>
      </section>
    );
  }

  const renderPejabatGrid = () => (
    <div className="mt-12">
      <h3 className="text-2xl font-heading font-bold text-slate-900 mb-6 text-center">
        Profil Pejabat
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pejabatData.slice(0, visibleCount).map((pejabat) => (
          <div key={pejabat.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-4 text-center">
              <h4 className="text-lg font-semibold text-slate-900">{pejabat.nama}</h4>
              <p className="text-slate-600 text-sm">{pejabat.jabatan}</p>
            </div>
            <img
              src={getPejabatImage(pejabat.foto_url)}
              alt={pejabat.nama}
              loading="lazy"
              className="w-full h-48 object-cover"
            />
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {visibleCount < pejabatData.length && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loadingMore ? 'Loading...' : 'Tampilkan Lebih Banyak'}
          </button>
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profil':
        return (
          <div className="space-y-6">
            <Card className="p-6 shadow-md">
              <h3 className="text-3xl font-heading font-bold text-slate-900 mb-4">
                {profile.profil.heading}
              </h3>
              <p className="text-slate-700 leading-relaxed text-base">
                {profile.profil.overview.join(' ')}
              </p>
            </Card>

            {renderPejabatGrid()}
          </div>
        );

      case 'visi_misi':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-8 shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Visi</h3>
              <p className="text-slate-700 text-lg mb-4">{profile.visi_misi.visi}</p>
              <p className="text-slate-600">{profile.visi_misi.explanation}</p>
            </Card>

            <Card className="p-8 shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Misi</h3>
              <ul className="space-y-3 text-slate-700">
                {profile.visi_misi.misi.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-slate-800 font-semibold">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        );

      case 'layanan':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {profile.layanan.services.map((service, index) => (
              <Card key={index} className="p-6 shadow-sm border border-slate-200">
                <h4 className="text-xl font-semibold text-slate-900 mb-2">{service.title}</h4>
                <p className="text-slate-600">{service.description}</p>
              </Card>
            ))}
          </div>
        );

      case 'struktur':
        return (
          <div className="space-y-8">
            <Card className="p-8 shadow-sm border border-slate-200 text-center">
              <h3 className="text-3xl font-bold text-slate-900 mb-4">
                {profile.struktur.heading}
              </h3>
              <p className="text-slate-700 mb-6">
                {profile.struktur.description}
              </p>
              {profile.struktur.image && (
                <img
                  src={profile.struktur.image}
                  alt="Struktur Organisasi"
                  className="mx-auto w-full max-w-3xl rounded-lg border border-slate-200"
                />
              )}
            </Card>
          </div>
        );

      case 'berita':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {profile.berita.items.map((item, index) => (
              <Card key={index} className="p-4 shadow-md">
                <h4 className="text-lg font-semibold text-slate-900 mb-2">
                  {item.title}
                </h4>
                <p className="text-slate-600 text-sm">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        );

      case 'pejabat_struktural':
        return renderPejabatGrid();

      default:
        return null;
    }
  };

  return (
    <section id="profile" className="bg-slate-50 section-padding">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-12">
          <h2 className="text-4xl font-heading font-bold text-slate-900 mb-4">
            {profile.title}
          </h2>
          <p className="text-slate-700 max-w-3xl mx-auto text-base">
            {profile.description}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {profile.tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-full px-5 py-2 text-sm font-semibold ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-700 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {renderTabContent()}
      </div>
    </section>
  );
}

export default ProfileSection;