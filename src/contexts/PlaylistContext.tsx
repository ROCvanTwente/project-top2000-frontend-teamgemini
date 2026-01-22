import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export interface Song {
  id: string; // string id
  title: string;
  artistName: string;
}

export interface ApiPlaylist {
  id: string; // string id
  name: string;
  createdAt: string;
  songs: Song[];
}

interface PlaylistContextType {
  playlists: ApiPlaylist[];
  createPlaylist: (name: string) => Promise<void>;
  deletePlaylist: (id: string) => void;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
  addSongToPlaylist: (playlistId: string, songId: string) => boolean;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export function PlaylistProvider({ children }: { children: React.ReactNode }) {
  const [playlists, setPlaylists] = useState<ApiPlaylist[]>([]);

  // Fetch playlists from backend
useEffect(() => {
  async function fetchPlaylists() {
    try {
      const res = await axios.get('http://localhost:5237/api/Playlist');
      console.log('API raw playlists:', res.data);

      // Pak de echte array uit $values
      const playlistsArray = res.data.$values || [];

      // Converteer naar het formaat dat je app verwacht
      const formattedPlaylists = playlistsArray.map((p: any) => ({
        id: p.id,
        name: p.name,
        createdAt: new Date().toISOString(), // placeholder date
        songs: p.playListSongs?.$values?.map((s: any) => ({
          id: s.songId,
          title: s.title,
          artistName: s.artist
        })) || []
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
      const res = await axios.post<ApiPlaylist>('http://localhost:5237/api/Playlist', { name });
      const newPlaylist = { ...res.data, id: res.data.id.toString() };
      setPlaylists([...playlists, newPlaylist]);
    } catch (err) {
      console.error('Fout bij aanmaken playlist:', err);
    }
  };

  const deletePlaylist = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5237/api/Playlist/${id}`);
      setPlaylists(playlists.filter(p => p.id !== id));
    } catch (err) {
      console.error('Fout bij verwijderen playlist:', err);
    }
  };

  const removeSongFromPlaylist = async (playlistId: string, songId: string) => {
    try {
      await axios.delete(`http://localhost:5237/api/Playlist/${playlistId}/songs/${songId}`);
      setPlaylists(playlists.map(p =>
        p.id === playlistId
          ? { ...p, songs: p.songs.filter(s => s.id !== songId) }
          : p
      ));
    } catch (err) {
      console.error('Fout bij verwijderen nummer:', err);
    }
  };

  const addSongToPlaylist = (playlistId: string, songId: string): boolean => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return false;
    if (playlist.songs.some(s => s.id === songId)) return false;

    const updatedPlaylists = playlists.map(p =>
      p.id === playlistId
        ? { ...p, songs: [...p.songs, { id: songId, title: 'Onbekend', artistName: 'Onbekend' }] }
        : p
    );
    setPlaylists(updatedPlaylists);
    return true;
  };

  return (
    <PlaylistContext.Provider value={{ playlists, createPlaylist, deletePlaylist, removeSongFromPlaylist, addSongToPlaylist }}>
      {children}
    </PlaylistContext.Provider>
  );
}

export function usePlaylist() {
  const context = useContext(PlaylistContext);
  if (!context) throw new Error('usePlaylist must be used within a PlaylistProvider');
  return context;
}
