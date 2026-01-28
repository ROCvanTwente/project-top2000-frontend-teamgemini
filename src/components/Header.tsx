import '../App.css';
import { useState, useRef, useEffect } from 'react';
import { djs } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [djMenuOpen, setDjMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  // Refs voor dropdowns
  const djMenuRef = useRef<HTMLDivElement>(null);
  const adminMenuRef = useRef<HTMLDivElement>(null);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (djMenuRef.current && !djMenuRef.current.contains(event.target as Node)) {
        setDjMenuOpen(false);
      }
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target as Node)) {
        setAdminMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <div className="header-logo" onClick={() => onNavigate('home')}>
            <div className="header-logo-box">
              <h1>TOP 2000</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hide-on-mobile header-nav">
            <button onClick={() => onNavigate('home')} className={`header-nav-button ${currentPage === 'home' ? 'active' : ''}`}>Home</button>
            <button onClick={() => onNavigate('rankings')} className={`header-nav-button ${currentPage === 'rankings' ? 'active' : ''}`}>Top2000</button>
            <button onClick={() => onNavigate('artists')} className={`header-nav-button ${currentPage === 'artists' ? 'active' : ''}`}>Artiesten</button>
            <button onClick={() => onNavigate(' ')} className={`header-nav-button ${currentPage === 'songs' ? 'active' : ''}`}>Nummers</button>
            <button onClick={() => onNavigate('statistics')} className={`header-nav-button ${currentPage === 'statistics' ? 'active' : ''}`}>Statistieken</button>
            {/* <button onClick={() => onNavigate('history')} className={`header-nav-button ${currentPage === 'history' ? 'active' : ''}`}>Geschiedenis</button> */}
                        {/* DJ Dropdown */}
            <div className="relative" ref={djMenuRef}>
              <button
                className="hover:text-gray-300 transition-colors header-nav-button"
                onClick={() => setDjMenuOpen(!djMenuOpen)}
              >
                DJ's
              </button>
              {djMenuOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white text-[var(--color-black)] rounded-lg shadow-xl py-2 min-w-[200px] z-50">
                  <a href="https://nl.wikipedia.org/wiki/Bart_Arens" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 hover:bg-gray-100 transition-colors">Bart Arens (Opening)</a>
                  <div className="border-t border-gray-200 my-2"></div>
                  {djs.map(dj => (
                    <a key={dj.name} href={dj.wikipediaLink} target="_blank" rel="noopener noreferrer" className="block px-4 py-2 hover:bg-gray-100 transition-colors">{dj.name}</a>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => onNavigate('faq')} className={`header-nav-button ${currentPage === 'faq' ? 'active' : ''}`}>FAQ</button>
            <button onClick={() => onNavigate('contact')} className={`header-nav-button ${currentPage === 'contact' ? 'active' : ''}`}>Contact</button>
            
            {/* {user?.role === 'user' && ( */}
            <button onClick={() => onNavigate('playlists')} className={`header-nav-button ${currentPage === 'playlists' ? 'active' : ''}`}>Playlists</button>
            {/* )} */}

{/* {user?.role === 'admin' && ( */}
            <div className="relative" ref={adminMenuRef}>
              <button
                className="hover:text-gray-300 transition-colors header-nav-button"
                onClick={() => setAdminMenuOpen(!adminMenuOpen)}
              >
                Beheren 
                

              </button>
              {adminMenuOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white text-[var(--color-black)] rounded-lg shadow-xl py-2 min-w-[200px] z-50">
                  <button
                    onClick={() => { onNavigate('adminSongs'); setAdminMenuOpen(false); }}
                    className="block w-full text-left px-4 py-2 hover:bg-red-100 transition-colors"
                  >
                    Songs beheren
                  </button>
                  <button
                    onClick={() => { onNavigate('adminArtists'); setAdminMenuOpen(false); }}
                    className="block w-full text-left px-4 py-2 hover:bg-red-100 transition-colors"
                  >
                    Artists beheren
                  </button>
                </div>
              )}
            </div>
{/* )} */}
            <div className="header-user-section">
              {user ? (
                <>
                  <span> {user.email}</span>
                  <button onClick={logout} className="header-logout-button" title="Uitloggen">⇥</button>
                </>
              ) : (
                <button onClick={() => onNavigate('login')} className="header-login-button">Inloggen</button>
              )}
            </div>
          </nav>

          <button className="show-on-mobile mobile-menu-button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="show-on-mobile mobile-nav">
            <button onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }} className="mobile-nav-button">Home</button>
            <button onClick={() => { onNavigate('rankings'); setMobileMenuOpen(false); }} className="mobile-nav-button">Jaaroverzichten</button>
            <button onClick={() => { onNavigate('artists'); setMobileMenuOpen(false); }} className="mobile-nav-button">Artiesten</button>
            <button onClick={() => { onNavigate('songs'); setMobileMenuOpen(false); }} className="mobile-nav-button">Nummers</button>
            <button onClick={() => { onNavigate('statistics'); setMobileMenuOpen(false); }} className="mobile-nav-button">Statistieken</button>
            <button onClick={() => { onNavigate('history'); setMobileMenuOpen(false); }} className="mobile-nav-button">Geschiedenis</button>
            <button onClick={() => { onNavigate('faq'); setMobileMenuOpen(false); }} className="mobile-nav-button">FAQ</button>
            <button onClick={() => { onNavigate('contact'); setMobileMenuOpen(false); }} className="mobile-nav-button">Contact</button>
            <button onClick={() => { onNavigate('playlists'); setMobileMenuOpen(false); }} className="mobile-nav-button">Mijn Lijsten</button>

            {user?.role === 'admin' && (
              <div className="mobile-admin-section">
                <p className="mobile-admin-title" onClick={() => setAdminMenuOpen(!adminMenuOpen)}>Beheren ▾</p>
                {adminMenuOpen && (
                  <div className="mobile-admin-dropdown">
                    <button
                      onClick={() => { onNavigate('adminSongs'); setMobileMenuOpen(false); setAdminMenuOpen(false); }}
                      className="block px-4 py-2 w-full text-left hover:bg-gray-100"
                    >
                      Songs beheren
                    </button>
                    <button
                      onClick={() => { onNavigate('adminArtists'); setMobileMenuOpen(false); setAdminMenuOpen(false); }}
                      className="block px-4 py-2 w-full text-left hover:bg-gray-100"
                    >
                      Artists beheren
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="mobile-dj-section">
              <p className="mobile-dj-title" onClick={() => setDjMenuOpen(!djMenuOpen)}>DJ's ▾</p>
              {djMenuOpen && (
                <div className="mobile-dj-dropdown">
                  <a href="https://nl.wikipedia.org/wiki/Bart_Arens" target="_blank" rel="noopener noreferrer">Bart Arens (Opening)</a>
                  {djs.map(dj => (
                    <a key={dj.name} href={dj.wikipediaLink} target="_blank" rel="noopener noreferrer">{dj.name}</a>
                  ))}
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
