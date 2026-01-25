import React, { useState } from 'react';
import { Plus, Trash2, Music, List, Play } from 'lucide-react';
import { usePlaylist, type ApiPlaylist } from '../../contexts/PlaylistContext';
import { useAuth } from '../../contexts/AuthContext';

interface PlaylistsPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export function PlaylistsPage({ onNavigate }: PlaylistsPageProps) {
  const { user } = useAuth();
  const {
    playlists,
    createPlaylist,
    deletePlaylist,
    removeSongFromPlaylist,
  } = usePlaylist();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(
    playlists.length > 0 ? playlists[0]?.id : null
  );
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const selectedPlaylist: ApiPlaylist | undefined = playlists.find(p => p.id === selectedPlaylistId);
  const playlistSongs = selectedPlaylist?.songs ?? [];

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    await createPlaylist(newPlaylistName);
    setToast({ type: 'success', message: `Playlist "${newPlaylistName}" aangemaakt!` });
    setNewPlaylistName('');
    setShowCreateForm(false);
    setTimeout(() => setToast(null), 3000);
  };

  const handleDeletePlaylist = async (id: string) => {
    await deletePlaylist(id);
    setToast({ type: 'success', message: 'Playlist verwijderd!' });
    if (selectedPlaylistId === id) setSelectedPlaylistId(playlists[0]?.id ?? null);
    setTimeout(() => setToast(null), 3000);
  };

  const handleRemoveSong = async (playlistId: string, songId: string) => {
    await removeSongFromPlaylist(playlistId, songId);
    setToast({ type: 'success', message: 'Nummer verwijderd!' });
    setTimeout(() => setToast(null), 3000);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-gray-lighter)]">
        <div className="bg-white p-8 rounded-xl shadow text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2">Inloggen vereist</h2>
          <p className="text-gray-600 mb-6">
            Je moet ingelogd zijn om playlists te bekijken of te maken.
          </p>
          <button
            onClick={() => onNavigate('login')}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
          >
            Inloggen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-gray-lighter)] py-12">
      <div className="max-w-7xl mx-auto px-4 relative">

        {/* Toast */}
        {toast && (
          <div className={`fixed top-4 right-4 p-4 rounded-lg text-white shadow-lg z-50 ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
            {toast.message}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[var(--color-gray-dark)] text-2xl font-bold">Mijn Afspeellijsten</h1>
            <p className="text-[var(--color-gray-medium)] mt-1">
              Beheer je playlists en nummers
            </p>
          </div>

          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
          >
            <Plus size={20} />
            Nieuwe playlist
          </button>
        </div>

        {/* Create Playlist Form */}
        {showCreateForm && (
          <div className="bg-white rounded-xl p-6 mb-8 shadow">
            <form onSubmit={handleCreatePlaylist} className="flex gap-4">
              <input
                value={newPlaylistName}
                onChange={e => setNewPlaylistName(e.target.value)}
                placeholder="Playlist naam"
                className="flex-1 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button type="submit" className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors">
                Opslaan
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="border px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Annuleren
              </button>
            </form>
          </div>
        )}

        <div className="grid grid-cols-4 gap-6">

          {/* Playlist List */}
          <div className="col-span-1 bg-white rounded-xl shadow overflow-hidden">
            <div className="p-4 font-semibold flex items-center gap-2 border-b">
              <List size={18} />
              Playlists ({playlists.length})
            </div>

            {playlists.length === 0 && (
              <div className="p-6 text-center text-gray-400">
                <Music size={48} className="mx-auto mb-4" />
                Je hebt nog geen playlists
              </div>
            )}

            {playlists.map(p => (
              <div
                key={p.id}
                onClick={() => setSelectedPlaylistId(p.id)}
                className={`p-4 cursor-pointer flex justify-between items-center rounded-lg transition-all mb-1 ${
                  p.id === selectedPlaylistId ? 'bg-blue-50 shadow-md' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Music size={16} className="text-gray-400" />
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-sm text-gray-500">{(p.songs ?? []).length} nummers</div>
                  </div>
                </div>

                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleDeletePlaylist(p.id);
                  }}
                  className="text-red-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Playlist Detail */}
          <div className="col-span-3 bg-white rounded-xl shadow overflow-hidden flex flex-col">
            {selectedPlaylist ? (
              <>
                {/* Playlist Header */}
                <div className="p-6 flex justify-between items-center bg-gray-800 text-white rounded-t-xl">
                  <div>
                    <h2 className="text-lg font-bold">{selectedPlaylist.name}</h2>
                    <div className="flex gap-4 text-sm mt-2">
                      <span className="flex items-center gap-1">
                        <Music size={16} />
                        {playlistSongs.length} nummers
                      </span>
                    </div>
                  </div>
                  {playlistSongs.length > 0 && (
                    <button className="bg-red-500 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-600 transition-colors">
                      <Play size={16} /> Speel Alles
                    </button>
                  )}
                </div>

                {/* Songs List */}
                {playlistSongs.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">
                    Geen nummers in deze playlist
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto">
                    {playlistSongs.map((song, index) => (
                      <div
                        key={song.id}
                        className="p-4 flex justify-between items-center border-b hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <div
                          onClick={() => onNavigate('song-detail', { songId: song.id })}
                        >
                          <div className="font-medium">
                            {index + 1}. {song.title}
                          </div>
                          <div className="text-sm text-gray-500">{song.artistName}</div>
                        </div>

                        <button
                          onClick={() => handleRemoveSong(selectedPlaylist.id, song.id)}
                          className="text-red-500 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="p-12 text-center text-gray-500">
                Selecteer een playlist
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}