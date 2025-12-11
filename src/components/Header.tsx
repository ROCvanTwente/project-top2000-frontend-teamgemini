import '../App.css';
import { useState } from 'react';
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
    <header>
      <div className='headerDiv'>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div 
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
            onClick={() => onNavigate('home')}
          >
            <div style={{ 
              backgroundColor: 'var(--color-gray-medium)', 
              textAlign: 'center', 
              width: '200px', 
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <h1 style={{ color: 'white', margin: 0, fontSize: '1.5rem' }}>TOP 2000</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hide-on-mobile">
            <button
              onClick={() => onNavigate('home')}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: currentPage === 'home' ? '#d1d5db' : 'white',
                textDecoration: currentPage === 'home' ? 'underline' : 'none',
                cursor: 'pointer',
                padding: '0.5rem'
              }}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('rankings')}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: currentPage === 'rankings' ? '#d1d5db' : 'white',
                textDecoration: currentPage === 'rankings' ? 'underline' : 'none',
                cursor: 'pointer',
                padding: '0.5rem'
              }}
            >
              Jaaroverzichten
            </button>
            <button
              onClick={() => onNavigate('artists')}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: currentPage === 'artists' ? '#d1d5db' : 'white',
                textDecoration: currentPage === 'artists' ? 'underline' : 'none',
                cursor: 'pointer',
                padding: '0.5rem'
              }}
            >
              Artiesten
            </button>
            <button
              onClick={() => onNavigate('songs')}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: currentPage === 'songs' ? '#d1d5db' : 'white',
                textDecoration: currentPage === 'songs' ? 'underline' : 'none',
                cursor: 'pointer',
                padding: '0.5rem'
              }}
            >
              Nummers
            </button>
            
            <button
              onClick={() => onNavigate('statistics')}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: currentPage === 'statistics' ? '#d1d5db' : 'white',
                textDecoration: currentPage === 'statistics' ? 'underline' : 'none',
                cursor: 'pointer',
                padding: '0.5rem'
              }}
            >
              Statistieken
            </button>
            
            {/* DJ's Menu */}
            <div 
              style={{ position: 'relative' }}
              onMouseEnter={() => setDjMenuOpen(true)}
              onMouseLeave={() => setDjMenuOpen(false)}
            >
              <button style={{ 
                background: 'none', 
                border: 'none', 
                color: 'white', 
                cursor: 'pointer',
                padding: '0.5rem'
              }}>
                DJ's
              </button>
              {djMenuOpen && (
                <div style={{ 
                  position: 'absolute', 
                  top: '100%', 
                  left: 0, 
                  marginTop: '0.5rem',
                  backgroundColor: 'white',
                  color: 'black',
                  borderRadius: '8px',
                  boxShadow: '0 10px 15px rgba(0,0,0,0.3)',
                  padding: '0.5rem 0',
                  minWidth: '200px'
                }}>
                  <a
                    href="https://nl.wikipedia.org/wiki/Bart_Arens"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                      display: 'block', 
                      padding: '0.5rem 1rem',
                      color: 'black',
                      textDecoration: 'none'
                    }}
                  >
                    Bart Arens (Opening)
                  </a>
                  <div style={{ borderTop: '1px solid #e5e7eb', margin: '0.5rem 0' }}></div>
                  {djs.map(dj => (
                    <a
                      key={dj.name}
                      href={dj.wikipediaLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ 
                        display: 'block', 
                        padding: '0.5rem 1rem',
                        color: 'black',
                        textDecoration: 'none'
                      }}
                    >
                      {dj.name}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => onNavigate('history')}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: currentPage === 'history' ? '#d1d5db' : 'white',
                textDecoration: currentPage === 'history' ? 'underline' : 'none',
                cursor: 'pointer',
                padding: '0.5rem'
              }}
            >
              Geschiedenis
            </button>
            <button
              onClick={() => onNavigate('faq')}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: currentPage === 'faq' ? '#d1d5db' : 'white',
                textDecoration: currentPage === 'faq' ? 'underline' : 'none',
                cursor: 'pointer',
                padding: '0.5rem'
              }}
            >
              FAQ
            </button>
            <button
              onClick={() => onNavigate('contact')}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: currentPage === 'contact' ? '#d1d5db' : 'white',
                textDecoration: currentPage === 'contact' ? 'underline' : 'none',
                cursor: 'pointer',
                padding: '0.5rem'
              }}
            >
              Contact
            </button>

            {user && (
              <>
                <button
                  onClick={() => onNavigate('playlists')}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: currentPage === 'playlists' ? '#d1d5db' : 'white',
                    textDecoration: currentPage === 'playlists' ? 'underline' : 'none',
                    cursor: 'pointer',
                    padding: '0.5rem'
                  }}
                >
                  Mijn Lijsten
                </button>
                {user.role === 'admin' && (
                  <button
                    onClick={() => onNavigate('admin')}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: currentPage === 'admin' ? '#d1d5db' : 'white',
                      textDecoration: currentPage === 'admin' ? 'underline' : 'none',
                      cursor: 'pointer',
                      padding: '0.5rem'
                    }}
                  >
                    Beheer
                  </button>
                )}
              </>
            )}

            {user ? (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                marginLeft: '1rem',
                borderLeft: '1px solid rgba(255,255,255,0.3)',
                paddingLeft: '1rem'
              }}>
                <span>👤</span>
                <span style={{ fontSize: '0.875rem' }}>{user.email}</span>
                <button
                  onClick={logout}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'white', 
                    cursor: 'pointer',
                    padding: '0.25rem'
                  }}
                  title="Uitloggen"
                >
                  ⇥
                </button>
              </div>
            ) : (
              <button
                onClick={() => onNavigate('login')}
                style={{ 
                  backgroundColor: 'white',
                  color: 'black',
                  border: 'none',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginLeft: '1rem'
                }}
              >
                Inloggen
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="show-on-mobile"
            style={{ 
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1.5rem',
              padding: '0.5rem'
            }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="show-on-mobile" style={{ 
            flexDirection: 'column',
            gap: '0.75rem',
            marginTop: '1rem',
            paddingBottom: '1rem'
          }}>
            <button
              onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'white', 
                textAlign: 'left',
                cursor: 'pointer',
                padding: '0.5rem'
              }}
            >
              Home
            </button>
            <button
              onClick={() => { onNavigate('rankings'); setMobileMenuOpen(false); }}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'white', 
                textAlign: 'left',
                cursor: 'pointer',
                padding: '0.5rem'
              }}
            >
              Jaaroverzichten
            </button>
            <button
              onClick={() => { onNavigate('artists'); setMobileMenuOpen(false); }}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'white', 
                textAlign: 'left',
                cursor: 'pointer',
                padding: '0.5rem'
              }}
            >
              Artiesten
            </button>
            <button
              onClick={() => { onNavigate('songs'); setMobileMenuOpen(false); }}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'white', 
                textAlign: 'left',
                cursor: 'pointer',
                padding: '0.5rem'
              }}
            >
              Nummers
            </button>
            <button
              onClick={() => { onNavigate('statistics'); setMobileMenuOpen(false); }}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'white', 
                textAlign: 'left',
                cursor: 'pointer',
                padding: '0.5rem'
              }}
            >
              Statistieken
            </button>
            <button
              onClick={() => { onNavigate('history'); setMobileMenuOpen(false); }}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'white', 
                textAlign: 'left',
                cursor: 'pointer',
                padding: '0.5rem'
              }}
            >
              Geschiedenis
            </button>
            <button
              onClick={() => { onNavigate('faq'); setMobileMenuOpen(false); }}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'white', 
                textAlign: 'left',
                cursor: 'pointer',
                padding: '0.5rem'
              }}
            >
              FAQ
            </button>
            <button
              onClick={() => { onNavigate('contact'); setMobileMenuOpen(false); }}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'white', 
                textAlign: 'left',
                cursor: 'pointer',
                padding: '0.5rem'
              }}
            >
              Contact
            </button>
            {user && (
              <button
                onClick={() => { onNavigate('playlists'); setMobileMenuOpen(false); }}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'white', 
                  textAlign: 'left',
                  cursor: 'pointer',
                  padding: '0.5rem'
                }}
              >
                Mijn Lijsten
              </button>
            )}
            {user?.role === 'admin' && (
              <button
                onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'white', 
                  textAlign: 'left',
                  cursor: 'pointer',
                  padding: '0.5rem'
                }}
              >
                Beheer
              </button>
            )}
            {user ? (
              <button
                onClick={() => { logout(); setMobileMenuOpen(false); }}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'white', 
                  textAlign: 'left',
                  cursor: 'pointer',
                  padding: '0.5rem'
                }}
              >
                Uitloggen ({user.email})
              </button>
            ) : (
              <button
                onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'white', 
                  textAlign: 'left',
                  cursor: 'pointer',
                  padding: '0.5rem'
                }}
              >
                Inloggen
              </button>
            )}

            {/* DJ Menu in Mobile */}
            <div style={{ paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>DJ's</p>
              <a
                href="https://nl.wikipedia.org/wiki/Bart_Arens"
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  display: 'block', 
                  padding: '0.25rem 0',
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '0.875rem'
                }}
              >
                Bart Arens (Opening)
              </a>
              {djs.map(dj => (
                <a
                  key={dj.name}
                  href={dj.wikipediaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ 
                    display: 'block', 
                    padding: '0.25rem 0',
                    color: 'white',
                    textDecoration: 'none',
                    fontSize: '0.875rem'
                  }}
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