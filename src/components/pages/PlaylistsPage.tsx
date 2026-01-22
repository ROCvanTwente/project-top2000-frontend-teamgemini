import React, { useState } from 'react';
import { Plus, Trash2, Music, List, Clock } from 'lucide-react';
import { usePlaylist, type ApiPlaylist } from '../../contexts/PlaylistContext';

interface PlaylistsPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export function PlaylistsPage({ onNavigate }: PlaylistsPageProps) {
  const {
    playlists,
    createPlaylist,
    deletePlaylist,
    removeSongFromPlaylist,
  } = usePlaylist();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(
  playlists.length > 0 ? playlists[0].id : null
);


  const selectedPlaylist: ApiPlaylist | undefined = Array.isArray(playlists)
    ? playlists.find(p => p.id === selectedPlaylistId)
    : undefined;

  const playlistSongs = selectedPlaylist?.songs ?? [];

  const playlistDate =
    selectedPlaylist?.createdAt && !isNaN(Date.parse(selectedPlaylist.createdAt))
      ? new Date(selectedPlaylist.createdAt)
      : null;

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    await createPlaylist(newPlaylistName);
    setNewPlaylistName('');
    setShowCreateForm(false);
  };

  return (
    <div className="min-h-screen bg-[var(--color-gray-lighter)] py-12">
      <div className="max-w-7xl mx-auto px-4">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[var(--color-gray-dark)]">Mijn Afspeellijsten</h1>
            <p className="text-[var(--color-gray-medium)] mt-1">
              Beheer je playlists
            </p>
          </div>

          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 bg-[var(--color-gray-dark)] text-white px-6 py-3 rounded-lg"
          >
            <Plus size={20} />
            Nieuwe playlist
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-white rounded-xl p-6 mb-8 shadow">
            <form onSubmit={handleCreatePlaylist} className="flex gap-4">
              <input
                value={newPlaylistName}
                onChange={e => setNewPlaylistName(e.target.value)}
                placeholder="Playlist naam"
                className="flex-1 border rounded-lg p-3"
              />
              <button type="submit" className="bg-[var(--color-gray-dark)] text-white px-6 rounded-lg">
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

        <div className="grid grid-cols-4 gap-6">

          <div className="col-span-1 bg-white rounded-xl shadow overflow-hidden">
            <div className="p-4 font-semibold flex items-center gap-2">
              <List size={18} />
              Playlists ({playlists.length})
            </div>

            {playlists.map(p => (
              <div
                key={p.id}
                onClick={() => setSelectedPlaylistId(p.id)}
                className={`p-4 cursor-pointer flex justify-between items-center ${
                  p.id === selectedPlaylistId ? 'bg-gray-100' : ''
                }`}
              >
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-sm text-gray-500">{(p.songs ?? []).length} nummers</div>
                </div>

                <button
                  onClick={e => {
                    e.stopPropagation();
                    deletePlaylist(p.id);
                  }}
                  className="text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div className="col-span-3 bg-white rounded-xl shadow overflow-hidden">
            {selectedPlaylist ? (
              <>
                <div className="p-6 bg-gray-800 text-white">
                  <h2>{selectedPlaylist.name}</h2>
                  <div className="flex gap-4 text-sm mt-2">
                    <span className="flex items-center gap-1">
                      <Music size={16} />
                      {playlistSongs.length} nummers
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {playlistDate ? playlistDate.toLocaleDateString() : 'Onbekend'}
                    </span>
                  </div>
                </div>

                {/* Songs */}
                {playlistSongs.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">
                    Geen nummers in deze playlist
                  </div>
                ) : (
                  playlistSongs.map((song, index) => (
                    <div
                      key={song.id}
                      className="p-4 flex justify-between items-center border-b"
                    >
                      <div
                        className="cursor-pointer"
                        onClick={() => onNavigate('song-detail', { songId: song.id })}
                      >
                        <div className="font-medium">{index + 1}. {song.title}</div>
                        <div className="text-sm text-gray-500">{song.artistName}</div>
                      </div>

                      <button
                        onClick={() => removeSongFromPlaylist(selectedPlaylist.id, song.id)}
                        className="text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))
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
