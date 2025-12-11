// Imported pages and components
import { useState } from 'react';
import "./App.css";
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
        <div className='logoDiv'>
          <Header onNavigate={handleNavigate} currentPage={navigation.page} />
          {renderPage()}
          
          {/* Footer */}
          <footer>
            <div className='FooterDiv'>
              <div className="responsive-grid-4">
                <div>
                  <div className='logo'>
                    <h3 className='footerH3Tag'>TOP 2000</h3>
                  </div>
                  <p className='footerPTag'>
                    De beste muziek aller tijden, elk jaar tussen Kerst en Oud & Nieuw op NPO Radio 2.
                  </p>
                </div>

                <div>
                  <h3 className='footerUlH3Tag'>Navigatie</h3>
                  <ul className='footerUl'>
                    <li className='footerLi'>
                      <button
                        onClick={() => handleNavigate('home')}
                        className='footerButton'
                      >
                        Home
                      </button>
                    </li>
                    <li className='footerLi'>
                      <button
                        onClick={() => handleNavigate('rankings')}
                        className='footerButton'
                      >
                        Jaaroverzichten
                      </button>
                    </li>
                    <li className='footerLi'>
                      <button
                        onClick={() => handleNavigate('artists')}
                        className='footerButton'
                      >
                        Artiesten
                      </button>
                    </li>
                    <li className='footerLi'>
                      <button
                        onClick={() => handleNavigate('songs')}
                        className='footerButton'
                      >
                        Nummers
                      </button>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className='footerUlH3Tag'>Informatie</h3>
                  <ul className='footerUl'>
                    <li className='footerLi'>
                      <button
                        onClick={() => handleNavigate('history')}
                        className='footerButton'
                      >
                        Geschiedenis
                      </button>
                    </li>
                    <li className='footerLi'>
                      <button
                        onClick={() => handleNavigate('faq')}
                        className='footerButton'
                      >
                        FAQ
                      </button>
                    </li>
                    <li className='footerLi'>
                      <button
                        onClick={() => handleNavigate('contact')}
                        className='footerButton'
                      >
                        Contact
                      </button>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className='footerUlH3Tag'>Contact</h3>
                  <ul className='footerUl footerPTag'>
                    <li className='footerLi'>NPO Radio 2</li>
                    <li className='footerLi'>Media Park</li>
                    <li className='footerLi'>1217 WE Hilversum</li>
                    <li className='footerLi'>info@top2000.nl</li>
                  </ul>
                </div>
              </div>

              <div className='footerBottomText'>
                <p className='footerRights'>© 2024 TOP 2000 - NPO Radio 2. Alle rechten voorbehouden.</p>
                <p className='footerDemoWebsite'>Demo website - Niet officieel</p>
              </div>
            </div>
          </footer>
        </div>
      </PlaylistProvider>
    </AuthProvider>
  );
}