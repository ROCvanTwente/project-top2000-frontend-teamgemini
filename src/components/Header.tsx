import '../App.css';
import { useState } from 'react';
import { djs } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

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
            <button
              onClick={() => onNavigate('home')}
              className={`header-nav-button ${currentPage === 'home' ? 'active' : ''}`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('rankings')}
              className={`header-nav-button ${currentPage === 'rankings' ? 'active' : ''}`}
            >
              Jaaroverzichten
            </button>
            <button
              onClick={() => onNavigate('artists')}
              className={`header-nav-button ${currentPage === 'artists' ? 'active' : ''}`}
            >
              Artiesten
            </button>
            <button
              onClick={() => onNavigate('songs')}
              className={`header-nav-button ${currentPage === 'songs' ? 'active' : ''}`}
            >
              Nummers
            </button>
            
            <button
              onClick={() => onNavigate('statistics')}
              className={`header-nav-button ${currentPage === 'statistics' ? 'active' : ''}`}
            >
              Statistieken
            </button>
            
            

            <button
              onClick={() => onNavigate('history')}
              className={`header-nav-button ${currentPage === 'history' ? 'active' : ''}`}
            >
              Geschiedenis
            </button>
            <button
              onClick={() => onNavigate('faq')}
              className={`header-nav-button ${currentPage === 'faq' ? 'active' : ''}`}
            >
              FAQ
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className={`header-nav-button ${currentPage === 'contact' ? 'active' : ''}`}
            >
              Contact
            </button>

            {/* Verwijderd: {user && ( */}
            <button
              onClick={() => onNavigate('playlists')}
              className={`header-nav-button ${currentPage === 'playlists' ? 'active' : ''}`}
            >
              Playlists
            </button>
            {/* )} */}

            {user?.role === 'admin' && (
              <button
                onClick={() => onNavigate('admin')}
                className={`header-nav-button ${currentPage === 'admin' ? 'active' : ''}`}
              >
                Beheer
              </button>
            )}

<div className="header-user-section">
  {/* {user?.role === 'admin' && (
    <button
      onClick={() => onNavigate('admin')}
      className={`header-nav-button admin-button ${currentPage === 'admin' ? 'active' : ''}`}
    >
      Beheer
    </button>
  )} */}

  {user ? (
    <>
      <span>👤</span>
      <span className="header-user-email">{user.email}</span>
      <button
        onClick={logout}
        className="header-logout-button"
        title="Uitloggen"
      >
        ⇥
      </button>
    </>
  ) : (
    <button
      onClick={() => onNavigate('login')}
      className="header-login-button"
    >
      Inloggen
    </button>
  )}
</div>

<button
  onClick={() => onNavigate('adminSongs')}
  className={`header-nav-button ${currentPage === 'adminSongs' ? 'active' : ''}`}
>
  Beheren
</button>

          </nav>


          {/* Mobile Menu Button */}
          <button
            className="show-on-mobile mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="show-on-mobile mobile-nav">
            <button
              onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
              className="mobile-nav-button"
            >
              Home
            </button>
            <button
              onClick={() => { onNavigate('rankings'); setMobileMenuOpen(false); }}
              className="mobile-nav-button"
            >
              Jaaroverzichten
            </button>
            <button
              onClick={() => { onNavigate('artists'); setMobileMenuOpen(false); }}
              className="mobile-nav-button"
            >
              Artiesten
            </button>
            <button
              onClick={() => { onNavigate('songs'); setMobileMenuOpen(false); }}
              className="mobile-nav-button"
            >
              Nummers
            </button>
            <button
              onClick={() => { onNavigate('statistics'); setMobileMenuOpen(false); }}
              className="mobile-nav-button"
            >
              Statistieken
            </button>
            <button
              onClick={() => { onNavigate('history'); setMobileMenuOpen(false); }}
              className="mobile-nav-button"
            >
              Geschiedenis
            </button>
            <button
              onClick={() => { onNavigate('faq'); setMobileMenuOpen(false); }}
              className="mobile-nav-button"
            >
              FAQ
            </button>
            <button
              onClick={() => { onNavigate('contact'); setMobileMenuOpen(false); }}
              className="mobile-nav-button"
            >
              Contact
            </button>
            {/* Verwijderd: {user && ( */}
            <button
              onClick={() => { onNavigate('playlists'); setMobileMenuOpen(false); }}
              className="mobile-nav-button"
            >
              Mijn Lijsten
            </button>
            {/* )} */}
            {user?.role === 'admin' && (
              <button
                onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
                className="mobile-nav-button"
              >
                Beheer
              </button>
            )}
            {user ? (
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                className="mobile-nav-button"
              >
                Uitloggen ({user.email})
              </button>
            ) : (
              <button
                onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }}
                className="mobile-nav-button"
              >
                Inloggen
              </button>
            )}

            {/* DJ Menu in Mobile */}
            <div className="mobile-dj-section">
              <p className="mobile-dj-title">DJ's</p>
              <a
                href="https://nl.wikipedia.org/wiki/Bart_Arens"
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-dj-link"
              >
                Bart Arens (Opening)
              </a>
              {djs.map(dj => (
                <a
                  key={dj.name}
                  href={dj.wikipediaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mobile-dj-link"
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