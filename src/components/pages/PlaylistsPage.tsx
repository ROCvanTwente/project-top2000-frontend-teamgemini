import React, { useState, useEffect } from 'react';
import { Plus, Trash2, List, Play } from 'lucide-react';
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
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // =========================
  // AUTOMATISCH EERSTE PLAYLIST SELECTEREN
  // =========================
  useEffect(() => {
    if (playlists.length > 0 && selectedPlaylistId === null) {
      setSelectedPlaylistId(playlists[0].id);
    }
  }, [playlists, selectedPlaylistId]);

  const selectedPlaylist: ApiPlaylist | undefined =
    playlists.find(p => p.id === selectedPlaylistId);
  const playlistSongs = selectedPlaylist?.songs ?? [];

  // =========================
  // HANDLE CREATE PLAYLIST
  // =========================
  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    await createPlaylist(newPlaylistName);
    setToast({
      type: 'success',
      message: `Playlist "${newPlaylistName}" succesvol aangemaakt`,
    });

    // Selecteer direct de nieuw aangemaakte playlist
    const newPlaylist = playlists.find(p => p.name === newPlaylistName);
    if (newPlaylist) setSelectedPlaylistId(newPlaylist.id);

    setNewPlaylistName('');
    setShowCreateForm(false);
    setTimeout(() => setToast(null), 3000);
  };

  // =========================
  // HANDLE DELETE PLAYLIST
  // =========================
  const handleDeletePlaylist = async (id: string) => {
    await deletePlaylist(id);
    setToast({ type: 'success', message: 'Playlist succesvol verwijderd' });

    // Als de verwijderde playlist geselecteerd was, selecteer de eerste in de lijst
    if (selectedPlaylistId === id) {
      setSelectedPlaylistId(playlists[0]?.id ?? null);
    }

    setTimeout(() => setToast(null), 3000);
  };

  // =========================
  // HANDLE REMOVE SONG
  // =========================
  const handleRemoveSong = async (playlistId: string, songId: string) => {
    await removeSongFromPlaylist(playlistId, songId);
    setToast({ type: 'success', message: 'Nummer succesvol uit playlist verwijderd' });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <>
      {/* TOAST */}
      {toast && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg text-white shadow-lg z-[9999]
            ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
        >
          {toast.message}
        </div>
      )}

      {!user ? (
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
      ) : (
        <div className="min-h-screen bg-[var(--color-gray-lighter)] py-6 px-4 sm:py-12 sm:px-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold">Mijn Afspeellijsten</h1>
                <p className="text-gray-500">Beheer je playlists en nummers</p>
              </div>

              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
              >
                <Plus size={18} />
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
                    className="flex-1 border rounded-lg p-3 focus:ring-2 focus:ring-red-500"
                  />
                  <button className="bg-red-500 text-white px-6 rounded-lg hover:bg-red-600">
                    Opslaan
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="border px-6 rounded-lg"
                  >
                    Annuleren
                  </button>
                </form>
              </div>
            )}

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Playlist List */}
              <div className="bg-white rounded-xl shadow">
                <div className="p-4 font-semibold border-b flex items-center gap-2">
                  <List size={18} />
                  Playlists ({playlists.length})
                </div>

                {playlists.map(p => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPlaylistId(p.id)}
                    className={`p-4 flex justify-between cursor-pointer hover:bg-gray-50 ${
                      p.id === selectedPlaylistId ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-sm text-gray-500">
                        {p.songs.length} nummers
                      </div>
                    </div>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleDeletePlaylist(p.id);
                      }}
                      className="text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Playlist Detail */}
              <div className="md:col-span-3 bg-white rounded-xl shadow flex flex-col">
                {selectedPlaylist ? (
                  <>
                    <div className="p-6 bg-gray-800 text-white flex justify-between">
                      <h2 className="font-bold">{selectedPlaylist.name}</h2>
                      {playlistSongs.length > 0 && (
                        <button className="bg-red-500 px-4 py-2 rounded-lg flex items-center gap-2">
                          <Play size={16} /> Speel alles
                        </button>
                      )}
                    </div>

                    <div className="flex-1 overflow-y-auto">
                      {playlistSongs.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                          Geen nummers in deze playlist
                        </div>
                      ) : (
                        playlistSongs.map((song, i) => (
                          <div
                            key={song.id}
                            className="p-4 border-b flex justify-between hover:bg-gray-50"
                          >
                            <div
                              onClick={() =>
                                onNavigate('song-detail', { songId: song.id })
                              }
                              className="cursor-pointer"
                            >
                              <div className="font-medium">
                                {i + 1}. {song.title}
                              </div>
                              <div className="text-gray-500">{song.artistName}</div>
                            </div>

                            <button
                              onClick={() =>
                                handleRemoveSong(selectedPlaylist.id, song.id)
                              }
                              className="text-red-500"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
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
      )}
    </>
  );
}
