import React, { createContext, useContext, useState, useEffect } from 'react';
import { type Playlist } from '../data/mockData';
import { useAuth } from './AuthContext';

interface PlaylistContextType {
  playlists: Playlist[];
  createPlaylist: (name: string) => void;
  deletePlaylist: (id: string) => void;
  addSongToPlaylist: (playlistId: string, songId: string) => boolean;
  removeSongFromPlaylist: (playlistId: string, songId: string) => void;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export function PlaylistProvider({ children }: { children: React.ReactNode }) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const savedPlaylists = localStorage.getItem(`top2000_playlists_${user.id}`);
      if (savedPlaylists) {
        setPlaylists(JSON.parse(savedPlaylists));
      }
    } else {
      setPlaylists([]);
    }
  }, [user]);

  const savePlaylists = (newPlaylists: Playlist[]) => {
    if (user) {
      localStorage.setItem(`top2000_playlists_${user.id}`, JSON.stringify(newPlaylists));
      setPlaylists(newPlaylists);
    }
  };

  const createPlaylist = (name: string) => {
    if (!user) return;
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      userId: user.id,
      name,
      songIds: [],
      createdAt: new Date(),
    };
    savePlaylists([...playlists, newPlaylist]);
  };

  const deletePlaylist = (id: string) => {
    savePlaylists(playlists.filter(p => p.id !== id));
  };

  const addSongToPlaylist = (playlistId: string, songId: string): boolean => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return false;
    if (playlist.songIds.includes(songId)) return false;

    const updatedPlaylists = playlists.map(p =>
      p.id === playlistId
        ? { ...p, songIds: [...p.songIds, songId] }
        : p
    );
    savePlaylists(updatedPlaylists);
    return true;
  };

  const removeSongFromPlaylist = (playlistId: string, songId: string) => {
    const updatedPlaylists = playlists.map(p =>
      p.id === playlistId
        ? { ...p, songIds: p.songIds.filter(id => id !== songId) }
        : p
    );
    savePlaylists(updatedPlaylists);
  };

  return (
    <PlaylistContext.Provider value={{ playlists, createPlaylist, deletePlaylist, addSongToPlaylist, removeSongFromPlaylist }}>
      {children}
    </PlaylistContext.Provider>
  );
}

export function usePlaylist() {
  const context = useContext(PlaylistContext);
  if (context === undefined) {
    throw new Error('usePlaylist must be used within a PlaylistProvider');
  }
  return context;
}
