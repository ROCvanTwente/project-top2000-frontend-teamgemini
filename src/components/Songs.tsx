import React, { useState, useEffect } from 'react';
import './Songs.css';

// @ts-ignore
import { fetchFromAPI } from '../api.js';

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
  <div className="popup-overlay" onClick={onClose}>
    <div className="popup-content" onClick={(e) => e.stopPropagation()}>
      <div className="popup-header">
        <h2>{song.titel}</h2>
        <button className="close-button" onClick={onClose}>&times;</button>
      </div>
      <div className="popup-body">
        <div className="song-info">
          <p><strong>Artist:</strong> {song.artistName}</p>
          <p><strong>Release Year:</strong> {song.releaseYear}</p>
        </div>
        
        {song.artistBiography && (
          <div className="artist-bio">
            <h3>Artist Biography</h3>
            <p>{song.artistBiography}</p>
          </div>
        )}
        
        {song.lyrics && (
          <div className="lyrics">
            <h3>Lyrics</h3>
            <p className="lyrics-text">{song.lyrics}</p>
          </div>
        )}
        
        {song.chartHistory && song.chartHistory.length > 0 && (
          <div className="chart-history">
            <h3>Chart History</h3>
            <div className="chart-list">
              {song.chartHistory.map((entry) => (
                <div key={entry.year} className="chart-entry">
                  <span className="chart-year">{entry.year}</span>
                  <span className="chart-position">#{entry.position}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

const Top9Songs: React.FC = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<SongDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTop9Songs = async () => {
      try {
        setLoading(true);
        // Fetch top 2000 for current year (2025) and take top 9
        const data = await fetchFromAPI('top2000/2025');
        setSongs(data.slice(0, 9));
      } catch (err) {
        console.error('Error fetching songs:', err);
        setError('Failed to load songs. Make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchTop9Songs();
  }, []);

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

  if (loading) {
    return <div className="loading">Loading top 9 songs...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="top9-container">
      <h1 className="top9-title">Top 9 Songs 2025</h1>
      <div className="songs-grid">
        {songs.map((song) => (
          <div
            key={song.songId}
            className="song-card"
            onClick={() => handleSongClick(song.songId)}
          >
            <div className="song-position">#{song.position}</div>
            <div className="song-info">
              <h3 className="song-title">{song.title}</h3>
              <p className="song-artist">{song.artist}</p>
              <p className="song-year">{song.releaseYear}</p>
            </div>
          </div>
        ))}
      </div>
      
      {selectedSong && (
        <SongPopup song={selectedSong} onClose={handleClosePopup} />
      )}
    </div>
  );
};

export default Top9Songs;