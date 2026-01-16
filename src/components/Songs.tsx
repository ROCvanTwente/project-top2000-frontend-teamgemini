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

interface Top9SongsProps {
  onNavigate?: (page: string, params?: any) => void;
}

const Top9Songs: React.FC<Top9SongsProps> = ({ onNavigate }) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTop9Songs = async () => {
      try {
        setLoading(true);
        const data = await fetchFromAPI('top2000/2024');
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

  const handleSongClick = (songId: number) => {
    if (onNavigate) {
      onNavigate('song-detail', { songId: songId.toString() });
    }
  };

  if (loading) {
    return <div className="loading">Loading top 9 songs...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="top9-container">
      <h1 className="top9-title">Top 9 Songs 2024</h1>
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
    </div>
  );
};

export default Top9Songs;