import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export interface Song {
  id: string;
  title: string;
  artistName: string;
}

export interface ApiPlaylist {
  id: string;
  name: string;
  createdAt: string;
  songs: Song[];
}

interface PlaylistContextType {
  playlists: ApiPlaylist[];
  createPlaylist: (name: string) => Promise<void>;
  deletePlaylist: (id: string) => Promise<void>;
  removeSongFromPlaylist: (playlistId: string, songId: string) => Promise<void>;
  addSongToPlaylist: (playlistId: string, songId: string) => Promise<boolean>;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export function PlaylistProvider({ children }: { children: React.ReactNode }) {
  const [playlists, setPlaylists] = useState<ApiPlaylist[]>([]);

  // Fetch playlists from backend
  useEffect(() => {
    async function fetchPlaylists() {
      try {
        const res = await axios.get(`${API_URL}/api/Playlist`);
        console.log('RAW playlists from API:', res.data);

        const raw = res.data.$values ?? [];

        // Filter refs eruit
        const formattedPlaylists = raw
          .filter((p: any) => p.id !== undefined)
          .map((p: any) => ({
            id: p.id.toString(),
            name: p.name,
            createdAt: p.createdAt,
            songs: (p.songs?.$values || []).map((s: any) => ({
              id: s.songId.toString(),
              title: s.title,
              artistName: s.artist
            }))
          }));

        setPlaylists(formattedPlaylists);
      } catch (err) {
        console.error('Fout bij ophalen playlists:', err);
        setPlaylists([]);
      }
    }

    fetchPlaylists();
  }, []);

  const createPlaylist = async (name: string) => {
    try {
      const res = await axios.post(`${API_URL}/api/Playlist`, { name });
      const newPlaylist = { ...res.data, id: res.data.id.toString(), songs: [] };
      setPlaylists(prev => [...prev, newPlaylist]);
    } catch (err) {
      console.error('Fout bij aanmaken playlist:', err);
    }
  };

  const deletePlaylist = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/api/Playlist/${id}`);
      setPlaylists(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Fout bij verwijderen playlist:', err);
    }
  };

  const removeSongFromPlaylist = async (playlistId: string, songId: string) => {
    try {
      await axios.delete(`${API_URL}/api/Playlist/${playlistId}/songs/${songId}`);
      setPlaylists(prev =>
        prev.map(p =>
          p.id === playlistId ? { ...p, songs: p.songs.filter(s => s.id !== songId) } : p
        )
      );
    } catch (err) {
      console.error('Fout bij verwijderen nummer:', err);
    }
  };

  const addSongToPlaylist = async (playlistId: string, songId: string): Promise<boolean> => {
    try {
      const playlist = playlists.find(p => p.id === playlistId);
      if (!playlist) return false;
      if (playlist.songs.some(s => s.id === songId)) return false;

      await axios.post(`${API_URL}/api/Playlist/${playlistId}/songs/${songId}`);

      setPlaylists(prev =>
        prev.map(p =>
          p.id === playlistId
            ? {
                ...p,
                songs: [...p.songs, { id: songId, title: 'Toegevoegd', artistName: '' }]
              }
            : p
        )
      );

      return true;
    } catch (err) {
      console.error('Fout bij toevoegen nummer:', err);
      return false;
    }
  };

  return (
    <PlaylistContext.Provider
      value={{ playlists, createPlaylist, deletePlaylist, removeSongFromPlaylist, addSongToPlaylist }}
    >
      {children}
    </PlaylistContext.Provider>
  );
}

export function usePlaylist() {
  const context = useContext(PlaylistContext);
  if (!context) throw new Error('usePlaylist must be used within a PlaylistProvider');
  return context;
}