import '../App.css';
import { useState, useRef, useEffect } from 'react';
import { djs } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import logo from '../data/Logo.png';
import './Header.css';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [djMenuMobileOpen, setDjMenuMobileOpen] = useState(false);
  const [djMenuOpen, setDjMenuOpen] = useState(false);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { user, logout } = useAuth();

  const djMenuRef = useRef<HTMLDivElement>(null);
  const adminMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
  document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'auto';
}, [mobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (djMenuRef.current && !djMenuRef.current.contains(event.target as Node)) setDjMenuOpen(false);
      if (adminMenuRef.current && !adminMenuRef.current.contains(event.target as Node)) setAdminMenuOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">

          {/* LOGO */}
          <div className="header-logo" onClick={() => onNavigate('home')}>
            <div className="header-logo-box">
              <img src={logo} alt="Top 2000 logo" className="header-logo-image" />
            </div>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hide-on-mobile header-nav">
            <button onClick={() => onNavigate('home')} className={`header-nav-button ${currentPage === 'home' ? 'active' : ''}`}>Home</button>
            <button onClick={() => onNavigate('rankings')} className={`header-nav-button ${currentPage === 'rankings' ? 'active' : ''}`}>Top2000</button>
            <button onClick={() => onNavigate('artists')} className={`header-nav-button ${currentPage === 'artists' ? 'active' : ''}`}>Artiesten</button>
            <button onClick={() => onNavigate('songs')} className={`header-nav-button ${currentPage === 'songs' ? 'active' : ''}`}>Nummers</button>
            <button onClick={() => onNavigate('statistics')} className={`header-nav-button ${currentPage === 'statistics' ? 'active' : ''}`}>Statistieken</button>
            

            {/* DJ DROPDOWN */}
            <div className="relative" ref={djMenuRef}>
<button
  className={`header-nav-button dropdown-button ${djMenuOpen ? 'open' : ''}`}
  onClick={() => setDjMenuOpen(!djMenuOpen)}
>
  DJ's
</button>
              {djMenuOpen && (
                <div className="dropdown">
                  <a href="https://nl.wikipedia.org/wiki/Bart_Arens" target="_blank" rel="noopener noreferrer">
                    Bart Arens (Opening)
                  </a>
                  <div className="dropdown-divider" />
                  {djs.map(dj => (
                    <a key={dj.name} href={dj.wikipediaLink} target="_blank" rel="noopener noreferrer">
                      {dj.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => onNavigate('faq')} className={`header-nav-button ${currentPage === 'faq' ? 'active' : ''}`}>FAQ</button>
            <button onClick={() => onNavigate('contact')} className={`header-nav-button ${currentPage === 'contact' ? 'active' : ''}`}>Contact</button>

            {/* {console.log(user)} */}
              {/* {user?.role === 'admin' && (   */}
              <div className="relative" ref={adminMenuRef}>
<button
  className={`header-nav-button dropdown-button ${adminMenuOpen ? 'open' : ''}`}
  onClick={() => setAdminMenuOpen(!adminMenuOpen)}
>
  Beheren
</button>
                {adminMenuOpen && (
                  <div className="dropdown">
                    <button onClick={() => { onNavigate('adminSongs'); setAdminMenuOpen(false); }}>
                      Songs beheren
                    </button>
                    <button onClick={() => { onNavigate('adminArtists'); setAdminMenuOpen(false); }}>
                      Artists beheren
                    </button>
                  </div>
                )}
              </div>
              {/* )} */}

                        {/* {user?.role === 'user' && (  */}
              <button
                onClick={() => onNavigate('playlists')}
                className={`header-nav-button ${currentPage === 'playlists' ? 'active' : ''}`}
              >
                Playlists
              </button>
            {/* )} */}

            {/* USER DROPDOWN */}
            <div className="header-user-section" ref={userMenuRef}>
              {!user ? (
                <button onClick={() => onNavigate('login')} className="header-login-button">
                  Inloggen
                </button>
              ) : (
                <>
              <button
                className={`header-nav-button dropdown-button ${userMenuOpen ? 'open' : ''}`}
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                {user.email}
              </button>

                  {userMenuOpen && (
                    <div className="dropdown dropdown-right">
                      { <button onClick={() => { onNavigate('profile'); setUserMenuOpen(false); }}>
                        Profiel
                      </button> }

                      {/* {user.role === 'admin' && (
                        <button onClick={() => { onNavigate('adminSongs'); setUserMenuOpen(false); }}>
                          Admin
                        </button>
                      )} */}

                      <div className="dropdown-divider" />

                      <button className="danger" onClick={logout}>
                        Uitloggen
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </nav>

          {/* MOBILE BUTTON */}
          <button className="show-on-mobile mobile-menu-button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* MOBILE MENU */}

        {mobileMenuOpen && (
          <nav className="show-on-mobile mobile-nav">
            <button onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }} className="mobile-nav-button">Home</button>
            <button onClick={() => { onNavigate('rankings'); setMobileMenuOpen(false); }} className="mobile-nav-button">Top2000</button>
            <button onClick={() => { onNavigate('artists'); setMobileMenuOpen(false); }} className="mobile-nav-button">Artiesten</button>
            <button onClick={() => { onNavigate('songs'); setMobileMenuOpen(false); }} className="mobile-nav-button">Nummers</button>
            <button onClick={() => { onNavigate('statistics'); setMobileMenuOpen(false); }} className="mobile-nav-button">Statistieken</button>
{/* DJ MOBILE DROPDOWN */}
<div className="mobile-nav-dropdown">
  <button
    className="mobile-nav-button"
    onClick={() => setDjMenuMobileOpen(!djMenuMobileOpen)}
  >
    DJ's {djMenuMobileOpen ? '▲' : '▼'}
  </button>
  {djMenuMobileOpen && (
    <div className="mobile-dropdown-content">
      <a
        href="https://nl.wikipedia.org/wiki/Bart_Arens"
        target="_blank"
        rel="noopener noreferrer"
      >
        Bart Arens (Opening)
      </a>
      {djs.map((dj) => (
        <a
          key={dj.name}
          href={dj.wikipediaLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          {dj.name}
        </a>
      ))}
    </div>
  )}
</div>
            {/* PLAYLISTS MOBILE — TERUG */}
            {/* {user?.role === 'user' && ( */}
              <button
                onClick={() => { onNavigate('playlists'); setMobileMenuOpen(false); }}
                className="mobile-nav-button"
              >
                Playlists
              </button>
            {/* )} */}

            <button onClick={() => { onNavigate('faq'); setMobileMenuOpen(false); }} className="mobile-nav-button">FAQ</button>
            <button onClick={() => { onNavigate('contact'); setMobileMenuOpen(false); }} className="mobile-nav-button">Contact</button>

            <div className="mobile-divider" />

            {!user ? (
              <button onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }} className="mobile-nav-button">
                Inloggen
              </button>
            ) : (
              <>
                <p className="mobile-user-email">{user.email}</p>

                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="mobile-nav-button danger">
                  Uitloggen
                </button>
                {
                <button onClick={() => { onNavigate('profile'); setMobileMenuOpen(false); }} className="mobile-nav-button">
                  Profiel
                </button> }
{/* 
                {user.role === 'admin' && (
                  <button onClick={() => { onNavigate('adminSongs'); setMobileMenuOpen(false); }} className="mobile-nav-button">
                    Admin
                  </button>
                )} */}

              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}