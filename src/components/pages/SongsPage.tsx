
import { useState, useEffect } from 'react';
import Top9Songs from '../Songs';
// @ts-ignore
import { fetchFromAPI } from '../../api.js';

interface Song {
  songId: number;
  position: number;
  title: string;
  artist: string;
  releaseYear: number;
}

interface SongDetails {
  songId: number;
  titel: string;
  artistName: string;
  lyrics: string;
  releaseYear: number;
  artistBiography: string;
  chartHistory: Array<{
    year: number;
    position: number;
  }>;
}

interface SongPopupProps {
  song: SongDetails;
  onClose: () => void;
}

const SongPopup: React.FC<SongPopupProps> = ({ song, onClose }) => (
  <div className="popup-overlay" onClick={onClose} style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px'
  }}>
    <div className="popup-content" onClick={(e) => e.stopPropagation()} style={{
      background: 'white',
      borderRadius: '15px',
      maxWidth: '800px',
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      animation: 'popupAppear 0.3s ease-out'
    }}>
      <div className="popup-header" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '25px 30px',
        borderBottom: '1px solid #eee',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: '15px 15px 0 0'
      }}>
        <h2 style={{ margin: 0, fontSize: '1.8rem', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
          {song.titel}
        </h2>
        <button 
          className="close-button" 
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '2rem',
            cursor: 'pointer',
            padding: 0,
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.3s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
        >
          &times;
        </button>
      </div>
      <div className="popup-body" style={{ padding: '30px' }}>
        <div className="song-info" style={{ marginBottom: '25px' }}>
          <p style={{ margin: '8px 0', fontSize: '1.1rem', color: '#333' }}>
            <strong>Artist:</strong> {song.artistName}
          </p>
          <p style={{ margin: '8px 0', fontSize: '1.1rem', color: '#333' }}>
            <strong>Release Year:</strong> {song.releaseYear}
          </p>
        </div>
        
        {song.artistBiography && (
          <div className="artist-bio" style={{ marginBottom: '25px' }}>
            <h3 style={{ 
              color: '#2c3e50', 
              marginBottom: '15px', 
              fontSize: '1.4rem', 
              borderBottom: '2px solid #667eea', 
              paddingBottom: '8px' 
            }}>
              Artist Biography
            </h3>
            <p>{song.artistBiography}</p>
          </div>
        )}
        
        {song.lyrics && (
          <div className="lyrics" style={{ marginBottom: '25px' }}>
            <h3 style={{ 
              color: '#2c3e50', 
              marginBottom: '15px', 
              fontSize: '1.4rem', 
              borderBottom: '2px solid #667eea', 
              paddingBottom: '8px' 
            }}>
              Lyrics
            </h3>
            <p style={{
              whiteSpace: 'pre-line',
              lineHeight: 1.6,
              background: '#f8f9fa',
              padding: '20px',
              borderRadius: '10px',
              borderLeft: '4px solid #667eea'
            }}>
              {song.lyrics}
            </p>
          </div>
        )}
        
        {song.chartHistory && song.chartHistory.length > 0 && (
          <div className="chart-history" style={{ marginBottom: '25px' }}>
            <h3 style={{ 
              color: '#2c3e50', 
              marginBottom: '15px', 
              fontSize: '1.4rem', 
              borderBottom: '2px solid #667eea', 
              paddingBottom: '8px' 
            }}>
              Chart History
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '10px'
            }}>
              {song.chartHistory.map((entry) => (
                <div 
                  key={entry.year} 
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    padding: '12px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{entry.year}</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>#{entry.position}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

interface SongsPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export function SongsPage({ onNavigate: _onNavigate }: SongsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<SongDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllSongs = async () => {
      try {
        setLoading(true);
        // Fetch all songs from 2025 (or latest year)
        const data = await fetchFromAPI('top2000/2025');
        setAllSongs(data);
        setFilteredSongs(data);
      } catch (err) {
        console.error('Error fetching all songs:', err);
        setError('Failed to load all songs. Make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllSongs();
  }, []);

  useEffect(() => {
    // Filter songs based on search term
    if (!searchTerm.trim()) {
      setFilteredSongs(allSongs);
    } else {
      const filtered = allSongs.filter(song =>
        song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSongs(filtered);
    }
  }, [searchTerm, allSongs]);

  const handleSongClick = async (songId: number) => {
    try {
      const songDetails = await fetchFromAPI(`songs/${songId}/stats`);
      setSelectedSong(songDetails);
    } catch (err) {
      console.error('Error fetching song details:', err);
      setError('Failed to load song details.');
    }
  };

  const handleClosePopup = () => {
    setSelectedSong(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-12 bg-gradient-to-b from-[var(--color-gray-dark)] to-[var(--color-gray-medium)]"></div>
          <h1>Alle Nummers in de TOP 2000</h1>
        </div>

        {/* Top 9 Songs Section */}
        <Top9Songs />

        {/* Search Bar */}
        <div className="my-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="Zoek op titel of artiest..."
              />
            </div>
            {searchTerm && (
              <p className="mt-2 text-sm text-gray-600">
                {filteredSongs.length} resultaten voor "{searchTerm}"
              </p>
            )}
          </div>
        </div>

        {/* Songs List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              Laden van alle nummers...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">
              {error}
            </div>
          ) : filteredSongs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchTerm ? `Geen nummers gevonden voor "${searchTerm}"` : 'Geen nummers beschikbaar'}
            </div>
          ) : (
            <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
              {filteredSongs.map((song) => (
                <div
                  key={song.songId}
                  onClick={() => handleSongClick(song.songId)}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-200 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {song.position}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 hover:text-blue-600">
                        {song.title}
                      </h3>
                      <p className="text-gray-600">{song.artist}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {song.releaseYear}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Song Details Popup */}
      {selectedSong && (
        <SongPopup song={selectedSong} onClose={handleClosePopup} />
      )}
    </div>
  );
}