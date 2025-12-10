import { useState } from 'react';
import { Header } from './components/Header';
import { HomePage } from './components/pages/HomePage';
import { RankingsPage } from './components/pages/RankingsPage';
import { ArtistsPage } from './components/pages/ArtistsPage';
import { ArtistDetailPage } from './components/pages/ArtistDetailPage';
import { ArtistSongsPage } from './components/pages/ArtistSongsPage';
import { SongsPage } from './components/pages/SongsPage';
import { SongDetailPage } from './components/pages/SongDetailPage';
import { HistoryPage } from './components/pages/HistoryPage';
import { FAQPage } from './components/pages/FAQPage';
import { ContactPage } from './components/pages/ContactPage';
import { LoginPage } from './components/pages/LoginPage';
import { PlaylistsPage } from './components/pages/PlaylistsPage';
import { AdminPage } from './components/pages/AdminPage';
import { EditArtistPage } from './components/pages/EditArtistPage';
import { EditSongPage } from './components/pages/EditSongPage';
import { StatisticsPage } from './components/pages/StatisticsPage';

type PageType = 
  | 'home' 
  | 'rankings' 
  | 'artists' 
  | 'artist-detail' 
  | 'artist-songs'
  | 'songs' 
  | 'song-detail' 
  | 'history' 
  | 'faq' 
  | 'contact' 
  | 'login'
  | 'playlists'
  | 'admin'
  | 'edit-artist'
  | 'edit-song'
  | 'statistics';

interface NavigationState {
  page: PageType;
  params?: any;
}

export default function App() {
  const [navigation, setNavigation] = useState<NavigationState>({
    page: 'home'
  });

  const handleNavigate = (page: string, params?: any) => {
    setNavigation({ page: page as PageType, params });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (navigation.page) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'rankings':
        return <RankingsPage onNavigate={handleNavigate} />;
      case 'artists':
        return <ArtistsPage onNavigate={handleNavigate} />;
      case 'artist-detail':
        return (
          <ArtistDetailPage
            artistId={navigation.params?.artistId}
            onNavigate={handleNavigate}
          />
        );
      case 'artist-songs':
        return (
          <ArtistSongsPage
            artistId={navigation.params?.artistId}
            onNavigate={handleNavigate}
          />
        );
      case 'songs':
        return <SongsPage onNavigate={handleNavigate} />;
      case 'song-detail':
        return (
          <SongDetailPage
            songId={navigation.params?.songId}
            onNavigate={handleNavigate}
          />
        );
      case 'statistics':
        return <StatisticsPage onNavigate={handleNavigate} />;
      case 'history':
        return <HistoryPage />;
      case 'faq':
        return <FAQPage />;
      case 'contact':
        return <ContactPage />;
      case 'login':
        return <LoginPage onNavigate={handleNavigate} />;
      case 'playlists':
        return <PlaylistsPage onNavigate={handleNavigate} />;
      case 'admin':
        return <AdminPage onNavigate={handleNavigate} />;
      case 'edit-artist':
        return (
          <EditArtistPage
            artistId={navigation.params?.artistId}
            onNavigate={handleNavigate}
          />
        );
      case 'edit-song':
        return (
          <EditSongPage
            songId={navigation.params?.songId}
            onNavigate={handleNavigate}
          />
        );
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Header onNavigate={handleNavigate} currentPage={navigation.page} />
      {renderPage()}
          
          {/* Footer */}
          <footer style={{ 
            backgroundColor: 'var(--color-gray-dark)', 
            color: 'white', 
            padding: '3rem 0',
            marginTop: '3rem',
            borderTop: '1px solid #4b5563'
          }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
              <div className="responsive-grid-4">
                <div>
                  <div style={{ 
                    backgroundColor: 'var(--color-gray-medium)',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    display: 'inline-block',
                    marginBottom: '1rem',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <h3 style={{ color: 'white', margin: 0 }}>TOP 2000</h3>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>
                    De beste muziek aller tijden, elk jaar tussen Kerst en Oud & Nieuw op NPO Radio 2.
                  </p>
                </div>

                <div>
                  <h3 style={{ color: 'white', marginBottom: '1rem' }}>Navigatie</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <button
                        onClick={() => handleNavigate('home')}
                        style={{ 
                          background: 'none',
                          border: 'none',
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          textAlign: 'left',
                          padding: 0
                        }}
                      >
                        Home
                      </button>
                    </li>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <button
                        onClick={() => handleNavigate('rankings')}
                        style={{ 
                          background: 'none',
                          border: 'none',
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          textAlign: 'left',
                          padding: 0
                        }}
                      >
                        Jaaroverzichten
                      </button>
                    </li>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <button
                        onClick={() => handleNavigate('artists')}
                        style={{ 
                          background: 'none',
                          border: 'none',
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          textAlign: 'left',
                          padding: 0
                        }}
                      >
                        Artiesten
                      </button>
                    </li>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <button
                        onClick={() => handleNavigate('songs')}
                        style={{ 
                          background: 'none',
                          border: 'none',
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          textAlign: 'left',
                          padding: 0
                        }}
                      >
                        Nummers
                      </button>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 style={{ color: 'white', marginBottom: '1rem' }}>Informatie</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <button
                        onClick={() => handleNavigate('history')}
                        style={{ 
                          background: 'none',
                          border: 'none',
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          textAlign: 'left',
                          padding: 0
                        }}
                      >
                        Geschiedenis
                      </button>
                    </li>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <button
                        onClick={() => handleNavigate('faq')}
                        style={{ 
                          background: 'none',
                          border: 'none',
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          textAlign: 'left',
                          padding: 0
                        }}
                      >
                        FAQ
                      </button>
                    </li>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <button
                        onClick={() => handleNavigate('contact')}
                        style={{ 
                          background: 'none',
                          border: 'none',
                          color: 'rgba(255,255,255,0.8)',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          textAlign: 'left',
                          padding: 0
                        }}
                      >
                        Contact
                      </button>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 style={{ color: 'white', marginBottom: '1rem' }}>Contact</h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)' }}>
                    <li style={{ marginBottom: '0.5rem' }}>NPO Radio 2</li>
                    <li style={{ marginBottom: '0.5rem' }}>Media Park</li>
                    <li style={{ marginBottom: '0.5rem' }}>1217 WE Hilversum</li>
                    <li style={{ marginTop: '1rem' }}>info@top2000.nl</li>
                  </ul>
                </div>
              </div>

              <div style={{ 
                borderTop: '1px solid rgba(255,255,255,0.2)',
                marginTop: '2rem',
                paddingTop: '2rem',
                textAlign: 'center',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '0.875rem'
              }}>
                <p style={{ margin: 0 }}>© 2024 TOP 2000 - NPO Radio 2. Alle rechten voorbehouden.</p>
                <p style={{ marginTop: '0.5rem' }}>Demo website - Niet officieel</p>
              </div>
            </div>
          </footer>
        </div>
  );
}