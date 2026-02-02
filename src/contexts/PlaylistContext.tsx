import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

export interface Song {
  id: string;
  title: string;
  artistName: string;
}

export interface ApiPlaylist {
  id: string;
  name: string;
  createdAt?: string;
  songs: Song[];
}

interface PlaylistContextType {
  playlists: ApiPlaylist[];
  createPlaylist: (name: string) => Promise<void>;
  deletePlaylist: (id: string) => Promise<void>;
  removeSongFromPlaylist: (playlistId: string, songId: string) => Promise<void>;
  addSongToPlaylist: (
    playlistId: string,
    songId: string,
    title: string,
    artistName: string
  ) => Promise<boolean>;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export function PlaylistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState<ApiPlaylist[]>([]);

  const getToken = () => localStorage.getItem('jwt');

  // =========================
  // FETCH PLAYLISTS
  // =========================
  useEffect(() => {
    async function fetchPlaylists() {
      try {
        if (!user) {
          setPlaylists([]);
          return;
        }

        const token = getToken();
        if (!token) return;

        const res = await axios.get(`${API_URL}/api/Playlist`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

const raw = res.data.$values ?? res.data ?? [];

const formatted: ApiPlaylist[] = raw.map((p: any) => ({
  id: p.id.toString(),
  name: p.name,
  createdAt: p.createdAt,
  songs: (p.songs?.$values || []).map((s: any) => ({
    id: s.songId.toString(),
    title: s.titel,
    artistName: s.artist
  })),
}));


        setPlaylists(formatted);
      } catch (err) {
        console.error('Fout bij ophalen playlists:', err);
        setPlaylists([]);
      }
    }

    fetchPlaylists();
  }, [user]);

  // =========================
  // CREATE PLAYLIST
  // =========================
  const createPlaylist = async (name: string) => {
    const token = getToken();
    if (!token) return;

    const res = await axios.post(
      `${API_URL}/api/Playlist`,
      { name },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setPlaylists(prev => [
      ...prev,
      { id: res.data.id.toString(), name: res.data.name, songs: [] },
    ]);
  };

  // =========================
  // DELETE PLAYLIST
  // =========================
  const deletePlaylist = async (id: string) => {
    const token = getToken();
    if (!token) return;

    await axios.delete(`${API_URL}/api/Playlist/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setPlaylists(prev => prev.filter(p => p.id !== id));
  };

  // =========================
  // ADD SONG
  // =========================
  const addSongToPlaylist = async (
    playlistId: string,
    songId: string,
    title: string,
    artistName: string
  ): Promise<boolean> => {
    try {
      const token = getToken();
      if (!token) return false;

      await axios.post(
        `${API_URL}/api/Playlist/${playlistId}/songs/${songId}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPlaylists(prev =>
        prev.map(p =>
          p.id === playlistId
            ? {
                ...p,
                songs: [...p.songs, { id: songId, title, artistName }],
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

  // =========================
  // REMOVE SONG
  // =========================
  const removeSongFromPlaylist = async (
    playlistId: string,
    songId: string
  ) => {
    const token = getToken();
    if (!token) return;

    await axios.delete(
      `${API_URL}/api/Playlist/${playlistId}/songs/${songId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setPlaylists(prev =>
      prev.map(p =>
        p.id === playlistId
          ? { ...p, songs: p.songs.filter(s => s.id !== songId) }
          : p
      )
    );
  };

  return (
    <PlaylistContext.Provider
      value={{
        playlists,
        createPlaylist,
        deletePlaylist,
        removeSongFromPlaylist,
        addSongToPlaylist,
      }}
    >
      {children}
    </PlaylistContext.Provider>
  );
}

export function usePlaylist() {
  const context = useContext(PlaylistContext);
  if (!context)
    throw new Error('usePlaylist must be used within PlaylistProvider');
  return context;
}
