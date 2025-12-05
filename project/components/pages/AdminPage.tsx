import React, { useState } from 'react';
import { Edit, Music, User } from 'lucide-react';
import { artists, songs } from '../../data/mockData';

interface AdminPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export function AdminPage({ onNavigate }: AdminPageProps) {
  const [activeTab, setActiveTab] = useState<'artists' | 'songs'>('artists');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredArtists = artists.filter(artist =>
    artist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const songsWithArtists = songs.map(song => {
    const artist = artists.find(a => a.id === song.artistId);
    return { ...song, artistName: artist?.name || 'Onbekend' };
  });

  const filteredSongs = songsWithArtists.filter(song =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artistName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-12 bg-gradient-to-b from-[var(--bright-blue)] to-[var(--vivid-purple)]"></div>
          <h1>Beheer</h1>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('artists')}
              className={`flex items-center gap-2 px-6 py-4 transition-colors ${
                activeTab === 'artists'
                  ? 'border-b-2 border-[var(--bright-blue)] text-[var(--bright-blue)]'
                  : 'text-gray-600 hover:text-[var(--bright-blue)]'
              }`}
            >
              <User size={20} />
              Artiesten ({artists.length})
            </button>
            <button
              onClick={() => setActiveTab('songs')}
              className={`flex items-center gap-2 px-6 py-4 transition-colors ${
                activeTab === 'songs'
                  ? 'border-b-2 border-[var(--bright-blue)] text-[var(--bright-blue)]'
                  : 'text-gray-600 hover:text-[var(--bright-blue)]'
              }`}
            >
              <Music size={20} />
              Nummers ({songs.length})
            </button>
          </div>

          <div className="p-6">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={activeTab === 'artists' ? 'Zoek artiest...' : 'Zoek nummer...'}
              className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-[var(--bright-blue)]"
            />
          </div>
        </div>

        {/* Content */}
        {activeTab === 'artists' ? (
          <div className="bg-white rounded-lg shadow-md">
            <div className="bg-[var(--midnight-blue)] text-white px-6 py-4">
              <h2 className="text-white">Artiesten Beheer</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {filteredArtists.map(artist => (
                <div
                  key={artist.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-grow">
                      <h3 className="mb-1">{artist.name}</h3>
                      <div className="text-sm text-gray-600">
                        {artist.bio ? 'Biografie: aanwezig' : 'Biografie: nog toe te voegen'} • 
                        {artist.wikipediaLink ? ' Wikipedia: aanwezig' : ' Wikipedia: nog toe te voegen'} • 
                        {artist.website ? ' Website: aanwezig' : ' Website: nog toe te voegen'}
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigate('edit-artist', { artistId: artist.id })}
                      className="flex items-center gap-2 px-4 py-2 border-2 border-[var(--bright-blue)] text-[var(--bright-blue)] rounded-lg hover:bg-[var(--bright-blue)] hover:text-white transition-colors"
                    >
                      <Edit size={18} />
                      Bewerken
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {filteredArtists.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                Geen artiesten gevonden
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md">
            <div className="bg-[var(--midnight-blue)] text-white px-6 py-4">
              <h2 className="text-white">Nummers Beheer</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {filteredSongs.map(song => (
                <div
                  key={song.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-grow">
                      <h3 className="mb-1">{song.title}</h3>
                      <div className="text-sm text-gray-600">
                        {song.artistName} • {song.releaseYear} • 
                        {song.lyrics ? ' Songtekst: aanwezig' : ' Songtekst: nog toe te voegen'} • 
                        {song.youtubeLink ? ' YouTube: aanwezig' : ' YouTube: nog toe te voegen'}
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigate('edit-song', { songId: song.id })}
                      className="flex items-center gap-2 px-4 py-2 border-2 border-[var(--bright-blue)] text-[var(--bright-blue)] rounded-lg hover:bg-[var(--bright-blue)] hover:text-white transition-colors"
                    >
                      <Edit size={18} />
                      Bewerken
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {filteredSongs.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                Geen nummers gevonden
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
