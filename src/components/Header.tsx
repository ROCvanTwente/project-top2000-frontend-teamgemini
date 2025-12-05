import { useState } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';
import { djs } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [djMenuOpen, setDjMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="bg-[var(--color-gray-dark)] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="cursor-pointer flex items-center gap-3"
            onClick={() => onNavigate('home')}
          >
            <div className="bg-[var(--color-gray-medium)] text-center w-50 m-4 py-1 rounded-lg border border-white/10">
              <h1 className="text-white">TOP 2000</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => onNavigate('home')}
              className={`hover:text-gray-300 transition-colors ${currentPage === 'home' ? 'text-gray-300 underline' : ''}`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('rankings')}
              className={`hover:text-gray-300 transition-colors ${currentPage === 'rankings' ? 'text-gray-300 underline' : ''}`}
            >
              Jaaroverzichten
            </button>
            <button
              onClick={() => onNavigate('artists')}
              className={`hover:text-gray-300 transition-colors ${currentPage === 'artists' ? 'text-gray-300 underline' : ''}`}
            >
              Artiesten
            </button>
            <button
              onClick={() => onNavigate('songs')}
              className={`hover:text-gray-300 transition-colors ${currentPage === 'songs' ? 'text-gray-300 underline' : ''}`}
            >
              Nummers
            </button>
            
            <button
              onClick={() => onNavigate('statistics')}
              className={`hover:text-gray-300 transition-colors ${currentPage === 'statistics' ? 'text-gray-300 underline' : ''}`}
            >
              Statistieken
            </button>
            
            {/* DJ's Menu */}
            <div 
              className="relative"
              onMouseEnter={() => setDjMenuOpen(true)}
              onMouseLeave={() => setDjMenuOpen(false)}
            >
              <button className="hover:text-gray-300 transition-colors">
                DJ's
              </button>
              {djMenuOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white text-[var(--color-black)] rounded-lg shadow-xl py-2 min-w-[200px]">
                  <a
                    href="https://nl.wikipedia.org/wiki/Bart_Arens"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                  >
                    Bart Arens (Opening)
                  </a>
                  <div className="border-t border-gray-200 my-2"></div>
                  {djs.map(dj => (
                    <a
                      key={dj.name}
                      href={dj.wikipediaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      {dj.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigate('history')}
              className={`hover:text-gray-300 transition-colors ${currentPage === 'history' ? 'text-gray-300 underline' : ''}`}
            >
              Geschiedenis
            </button>
            <button
              onClick={() => onNavigate('faq')}
              className={`hover:text-gray-300 transition-colors ${currentPage === 'faq' ? 'text-gray-300 underline' : ''}`}
            >
              FAQ
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className={`hover:text-gray-300 transition-colors ${currentPage === 'contact' ? 'text-gray-300 underline' : ''}`}
            >
              Contact
            </button>

            {user && (
              <>
                <button
                  onClick={() => onNavigate('playlists')}
                  className={`hover:text-gray-300 transition-colors ${currentPage === 'playlists' ? 'text-gray-300 underline' : ''}`}
                >
                  Mijn Lijsten
                </button>
                {user.role === 'admin' && (
                  <button
                    onClick={() => onNavigate('admin')}
                    className={`hover:text-gray-300 transition-colors ${currentPage === 'admin' ? 'text-gray-300 underline' : ''}`}
                  >
                    Beheer
                  </button>
                )}
              </>
            )}

            {user ? (
              <div className="flex items-center gap-3 ml-4 border-l border-white/30 pl-4">
                <User size={20} />
                <span className="text-sm">{user.email}</span>
                <button
                  onClick={logout}
                  className="hover:text-gray-300 transition-colors"
                  title="Uitloggen"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors ml-4"
              >
                Inloggen
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-3">
            <button
              onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
              className="text-left hover:text-gray-300 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => { onNavigate('rankings'); setMobileMenuOpen(false); }}
              className="text-left hover:text-gray-300 transition-colors"
            >
              Jaaroverzichten
            </button>
            <button
              onClick={() => { onNavigate('artists'); setMobileMenuOpen(false); }}
              className="text-left hover:text-gray-300 transition-colors"
            >
              Artiesten
            </button>
            <button
              onClick={() => { onNavigate('songs'); setMobileMenuOpen(false); }}
              className="text-left hover:text-gray-300 transition-colors"
            >
              Nummers
            </button>
            <button
              onClick={() => { onNavigate('statistics'); setMobileMenuOpen(false); }}
              className="text-left hover:text-gray-300 transition-colors"
            >
              Statistieken
            </button>
            <button
              onClick={() => { onNavigate('history'); setMobileMenuOpen(false); }}
              className="text-left hover:text-gray-300 transition-colors"
            >
              Geschiedenis
            </button>
            <button
              onClick={() => { onNavigate('faq'); setMobileMenuOpen(false); }}
              className="text-left hover:text-gray-300 transition-colors"
            >
              FAQ
            </button>
            <button
              onClick={() => { onNavigate('contact'); setMobileMenuOpen(false); }}
              className="text-left hover:text-gray-300 transition-colors"
            >
              Contact
            </button>
            {user && (
              <button
                onClick={() => { onNavigate('playlists'); setMobileMenuOpen(false); }}
                className="text-left hover:text-gray-300 transition-colors"
              >
                Mijn Lijsten
              </button>
            )}
            {user?.role === 'admin' && (
              <button
                onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
                className="text-left hover:text-gray-300 transition-colors"
              >
                Beheer
              </button>
            )}
            {user ? (
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="text-left hover:text-gray-300 transition-colors"
              >
                Uitloggen ({user.email})
              </button>
            ) : (
              <button
                onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }}
                className="text-left hover:text-gray-300 transition-colors"
              >
                Inloggen
              </button>
            )}

            {/* DJ Menu in Mobile */}
            <div className="pt-2 border-t border-white/20">
              <p className="text-white/60 text-sm mb-2">DJ's</p>
              <a
                href="https://nl.wikipedia.org/wiki/Bart_Arens"
                target="_blank"
                rel="noopener noreferrer"
                className="block py-1 text-left hover:text-gray-300 transition-colors text-sm"
              >
                Bart Arens (Opening)
              </a>
              {djs.map(dj => (
                <a
                  key={dj.name}
                  href={dj.wikipediaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block py-1 text-left hover:text-gray-300 transition-colors text-sm"
                >
                  {dj.name}
                </a>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}