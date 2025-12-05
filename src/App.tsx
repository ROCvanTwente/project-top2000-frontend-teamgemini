import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { PlaylistProvider } from './contexts/PlaylistContext';
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
    <AuthProvider>
      <PlaylistProvider>
        <div className="min-h-screen bg-gray-50">
          <Header onNavigate={handleNavigate} currentPage={navigation.page} />
          {renderPage()}
          
          {/* Footer */}
          <footer className="bg-[var(--color-gray-dark)] text-white py-12 mt-12 border-t border-gray-700">
            <div className="max-w-7xl mx-auto px-4">
              <div className="grid md:grid-cols-4 gap-8">
                <div>
                  <div className="bg-[var(--color-gray-medium)] px-4 py-3 rounded-lg inline-block mb-4 border border-white/10">
                    <h3 className="text-white">TOP 2000</h3>
                  </div>
                  <p className="text-white/80 text-sm">
                    De beste muziek aller tijden, elk jaar tussen Kerst en Oud & Nieuw op NPO Radio 2.
                  </p>
                </div>

                <div>
                  <h3 className="text-white mb-4">Navigatie</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <button
                        onClick={() => handleNavigate('home')}
                        className="text-white/80 hover:text-white transition-colors"
                      >
                        Home
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleNavigate('rankings')}
                        className="text-white/80 hover:text-white transition-colors"
                      >
                        Jaaroverzichten
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleNavigate('artists')}
                        className="text-white/80 hover:text-white transition-colors"
                      >
                        Artiesten
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleNavigate('songs')}
                        className="text-white/80 hover:text-white transition-colors"
                      >
                        Nummers
                      </button>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white mb-4">Informatie</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <button
                        onClick={() => handleNavigate('history')}
                        className="text-white/80 hover:text-white transition-colors"
                      >
                        Geschiedenis
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleNavigate('faq')}
                        className="text-white/80 hover:text-white transition-colors"
                      >
                        FAQ
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleNavigate('contact')}
                        className="text-white/80 hover:text-white transition-colors"
                      >
                        Contact
                      </button>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-white mb-4">Contact</h3>
                  <ul className="space-y-2 text-sm text-white/80">
                    <li>NPO Radio 2</li>
                    <li>Media Park</li>
                    <li>1217 WE Hilversum</li>
                    <li className="mt-4">info@top2000.nl</li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60 text-sm">
                <p>© 2024 TOP 2000 - NPO Radio 2. Alle rechten voorbehouden.</p>
                <p className="mt-2">Demo website - Niet officieel</p>
              </div>
            </div>
          </footer>
        </div>
      </PlaylistProvider>
    </AuthProvider>
  );
}