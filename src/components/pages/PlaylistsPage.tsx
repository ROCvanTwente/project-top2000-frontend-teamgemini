import { useState } from 'react';
import { Plus, Trash2, Music, List } from 'lucide-react';
import { usePlaylist } from '../../contexts/PlaylistContext';
import { songs, artists } from '../../data/mockData';

interface PlaylistsPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export function PlaylistsPage({ onNavigate }: PlaylistsPageProps) {
  const { playlists, createPlaylist, deletePlaylist, removeSongFromPlaylist } = usePlaylist();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(
    playlists.length > 0 ? playlists[0].id : null
  );

  const handleCreatePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName);
      setNewPlaylistName('');
      setShowCreateForm(false);
    }
  };

  const handleDeletePlaylist = (id: string) => {
    if (confirm('Weet je zeker dat je deze afspeellijst wilt verwijderen?')) {
      deletePlaylist(id);
      if (selectedPlaylist === id) {
        setSelectedPlaylist(playlists.length > 1 ? playlists[0].id : null);
      }
    }
  };

  const currentPlaylist = playlists.find(p => p.id === selectedPlaylist);

  const playlistSongs = currentPlaylist
    ? currentPlaylist.songIds.map(songId => {
        const song = songs.find(s => s.id === songId);
        const artist = song ? artists.find(a => a.id === song.artistId) : null;
        return { song, artist };
      }).filter(item => item.song && item.artist)
    : [];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-12 bg-gradient-to-b from-[var(--bright-blue)] to-[var(--vivid-purple)]"></div>
            <h1>Mijn Afspeellijsten</h1>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 bg-[var(--bright-blue)] hover:bg-[var(--vivid-purple)] text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
            Nieuwe lijst
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="mb-4">Nieuwe afspeellijst maken</h2>
            <form onSubmit={handleCreatePlaylist} className="flex gap-4">
              <input
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Naam van de afspeellijst"
                className="flex-grow border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-[var(--bright-blue)]"
                autoFocus
              />
              <button
                type="submit"
                className="bg-[var(--bright-blue)] hover:bg-[var(--vivid-purple)] text-white px-6 py-3 rounded-lg transition-colors"
              >
                Aanmaken
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setNewPlaylistName('');
                }}
                className="border-2 border-gray-300 hover:border-gray-400 px-6 py-3 rounded-lg transition-colors"
              >
                Annuleren
              </button>
            </form>
          </div>
        )}

        {playlists.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <List className="mx-auto mb-4 text-gray-400" size={64} />
            <h2 className="mb-4">Nog geen afspeellijsten</h2>
            <p className="text-gray-600 mb-6">
              Maak je eerste afspeellijst aan om je favoriete TOP 2000 nummers te verzamelen
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-[var(--bright-blue)] hover:bg-[var(--vivid-purple)] text-white px-6 py-3 rounded-lg transition-colors"
            >
              Maak je eerste lijst
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-4 gap-6">
            {/* Playlists sidebar */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-[var(--midnight-blue)] text-white p-4">
                  <h3 className="text-white">Lijsten ({playlists.length})</h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {playlists.map(playlist => (
                    <div
                      key={playlist.id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedPlaylist === playlist.id ? 'bg-blue-50 border-l-4 border-[var(--bright-blue)]' : ''
                      }`}
                      onClick={() => setSelectedPlaylist(playlist.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-grow">
                          <div className="truncate">{playlist.name}</div>
                          <div className="text-sm text-gray-600">{playlist.songIds.length} nummers</div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePlaylist(playlist.id);
                          }}
                          className="text-red-500 hover:text-red-700 transition-colors ml-2"
                          title="Verwijder lijst"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Playlist content */}
            <div className="md:col-span-3">
              {currentPlaylist ? (
                <div className="bg-white rounded-lg shadow-md">
                  <div className="bg-gradient-to-r from-[var(--bright-blue)] to-[var(--vivid-purple)] text-white p-6">
                    <h2 className="text-white mb-2">{currentPlaylist.name}</h2>
                    <p className="text-white/80">
                      {playlistSongs.length} {playlistSongs.length === 1 ? 'nummer' : 'nummers'}
                    </p>
                  </div>

                  {playlistSongs.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                      <Music className="mx-auto mb-4" size={48} />
                      <p>Deze afspeellijst is nog leeg</p>
                      <p className="text-sm mt-2">Voeg nummers toe vanaf de nummerpagina's</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {playlistSongs.map(({ song, artist }, index) => (
                        <div
                          key={song!.id}
                          className="p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-8 text-gray-400">{index + 1}</div>
                            <div
                              className="flex-grow cursor-pointer"
                              onClick={() => onNavigate('song-detail', { songId: song!.id })}
                            >
                              <h3 className="mb-1 hover:text-[var(--bright-blue)]">{song!.title}</h3>
                              <p className="text-gray-600 text-sm">{artist!.name}</p>
                            </div>
                            <button
                              onClick={() => removeSongFromPlaylist(currentPlaylist.id, song!.id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                              title="Verwijder uit lijst"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-12 text-center text-gray-500">
                  Selecteer een afspeellijst om te bekijken
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
