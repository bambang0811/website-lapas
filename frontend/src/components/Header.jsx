import { useState } from 'react';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', id: 'home' },
    { name: 'Berita', id: 'berita' },
    { name: 'Profile', id: 'profile' },
    { name: 'Alamat', id: 'alamat' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo-lapas.svg"
              alt="Logo LAPAS Karawang"
              className="h-12 w-12 rounded-lg"
            />
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300">
                Lembaga Pemasyarakatan
              </div>
              <div className="text-base font-bold">Kelas II A Karawang</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <nav className="flex items-center gap-2">
              {navigation.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="px-4 py-2 text-sm font-medium text-white hover:text-blue-200"
                >
                  {item.name}
                </a>
              ))}
            </nav>
            <a
              href="/admin"
              className="ml-4 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Admin
            </a>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-white rounded-lg hover:bg-slate-800"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-950">
            <div className="flex flex-col px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setIsMenuOpen(false)}
                    className="block rounded-lg px-4 py-3 text-sm font-medium text-white hover:bg-slate-800"
                >
                  {item.name}
                </a>
              ))}
              <a
                href="/admin"
                className="rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
              >
                Admin
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;

