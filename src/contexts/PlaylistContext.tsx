import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Playlist } from '../types';
import { useAuth } from './AuthContext';

interface PlaylistContextType {
  playlists: Playlist[];
  createPlaylist: (name: string) => Promise<void>;
  deletePlaylist: (id: string) => Promise<void>;
  addSongToPlaylist: (playlistId: string, songId: string) => Promise<boolean>;
  removeSongFromPlaylist: (playlistId: string, songId: string) => Promise<void>;
  loading: boolean;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export function PlaylistProvider({ children }: { children: React.ReactNode }) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, _setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // TODO: Fetch playlists from your backend API
      // Example implementation:
      // const fetchPlaylists = async () => {
      //   setLoading(true);
      //   try {
      //     const response = await fetch(`/api/playlists?userId=${user.id}`);
      //     if (response.ok) {
      //       const data = await response.json();
      //       setPlaylists(data);
      //     }
      //   } catch (error) {
      //     console.error('Failed to fetch playlists:', error);
      //   } finally {
      //     setLoading(false);
      //   }
      // };
      // fetchPlaylists();
      
      setPlaylists([]);
    } else {
      setPlaylists([]);
    }
  }, [user]);

  const createPlaylist = async (_name: string): Promise<void> => {
    if (!user) return;
    
    // TODO: Create playlist via your backend API
    // Example implementation:
    // try {
    //   const response = await fetch('/api/playlists', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ name: _name, userId: user.id })
    //   });
    //   if (response.ok) {
    //     const newPlaylist = await response.json();
    //     setPlaylists([...playlists, newPlaylist]);
    //   }
    // } catch (error) {
    //   console.error('Failed to create playlist:', error);
    // }
    
    console.warn('Create playlist not implemented - connect to your backend API');
  };

  const deletePlaylist = async (_id: string): Promise<void> => {
    // TODO: Delete playlist via your backend API
    // Example implementation:
    // try {
    //   const response = await fetch(`/api/playlists/${_id}`, {
    //     method: 'DELETE'
    //   });
    //   if (response.ok) {
    //     setPlaylists(playlists.filter(p => p.id !== _id));
    //   }
    // } catch (error) {
    //   console.error('Failed to delete playlist:', error);
    // }
    
    console.warn('Delete playlist not implemented - connect to your backend API');
  };

  const addSongToPlaylist = async (_playlistId: string, _songId: string): Promise<boolean> => {
    // TODO: Add song to playlist via your backend API
    // Example implementation:
    // try {
    //   const response = await fetch(`/api/playlists/${_playlistId}/songs`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ songId: _songId })
    //   });
    //   if (response.ok) {
    //     const updatedPlaylists = playlists.map(p =>
    //       p.id === _playlistId
    //         ? { ...p, songIds: [...p.songIds, _songId] }
    //         : p
    //     );
    //     setPlaylists(updatedPlaylists);
    //     return true;
    //   }
    //   return false;
    // } catch (error) {
    //   console.error('Failed to add song to playlist:', error);
    //   return false;
    // }
    
    console.warn('Add song to playlist not implemented - connect to your backend API');
    return false;
  };

  const removeSongFromPlaylist = async (_playlistId: string, _songId: string): Promise<void> => {
    // TODO: Remove song from playlist via your backend API
    // Example implementation:
    // try {
    //   const response = await fetch(`/api/playlists/${_playlistId}/songs/${_songId}`, {
    //     method: 'DELETE'
    //   });
    //   if (response.ok) {
    //     const updatedPlaylists = playlists.map(p =>
    //       p.id === _playlistId
    //         ? { ...p, songIds: p.songIds.filter(id => id !== _songId) }
    //         : p
    //     );
    //     setPlaylists(updatedPlaylists);
    //   }
    // } catch (error) {
    //   console.error('Failed to remove song from playlist:', error);
    // }
    
    console.warn('Remove song from playlist not implemented - connect to your backend API');
  };

  return (
    <PlaylistContext.Provider value={{ playlists, createPlaylist, deletePlaylist, addSongToPlaylist, removeSongFromPlaylist, loading }}>
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
