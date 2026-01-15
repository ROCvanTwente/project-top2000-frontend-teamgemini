import React, { useState, useEffect } from 'react';
import './Songs.css'; // We kunnen dezelfde CSS gebruiken
// @ts-ignore
import { fetchFromAPI } from '../api.js';

interface Artist {
  artistId: number;
  name: string;
  songsCount: number;
  photo?: string | null;
}

interface Top9ArtistsProps {
  onNavigate?: (page: string, params?: any) => void;
}

const Top9Artists: React.FC<Top9ArtistsProps> = ({ onNavigate }) => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTop9Artists = async () => {
      try {
        setLoading(true);
        // Fetch all artists and take top 9 by song count
        const data = await fetchFromAPI('artist');
        // Sort by song count (descending) and take top 9
        const sortedArtists = data
          .map((artist: any) => ({
            artistId: artist.artistId,
            name: artist.name,
            songsCount: artist.songs.length,
            photo: artist.photo
          }))
          .sort((a: Artist, b: Artist) => b.songsCount - a.songsCount)
          .slice(0, 9);
        setArtists(sortedArtists);
      } catch (err) {
        console.error('Error fetching artists:', err);
        setError('Failed to load artists. Make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchTop9Artists();
  }, []);

  const handleArtistClick = (artistId: number) => {
    if (onNavigate) {
      onNavigate('artist-detail', { artistId: artistId.toString() });
    }
  };

  if (loading) {
    return <div className="loading">Loading top 9 artists...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="top9-container">
      <h1 className="top9-title">Top 9 Artiesten</h1>
      <div className="songs-grid">
        {artists.map((artist, index) => (
          <div
            key={artist.artistId}
            className="song-card"
            onClick={() => handleArtistClick(artist.artistId)}
          >
            <div className="song-position">#{index + 1}</div>
            <div className="song-info">
              <h3 className="song-title">{artist.name}</h3>
              <p className="song-artist">{artist.songsCount} {artist.songsCount === 1 ? 'nummer' : 'nummers'}</p>
              {artist.photo && (
                <div className="artist-photo">
                  <img 
                    src={artist.photo} 
                    alt={artist.name}
                    className="w-full h-20 object-cover rounded mt-2"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Top9Artists;
