import { useState, useMemo, useEffect } from 'react';
import { Search, Music } from 'lucide-react';
import type { Artist, Song, Ranking } from '../../types';

interface ArtistsPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export function ArtistsPage({ onNavigate }: ArtistsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'count'>('name');
  const [artists, _setArtists] = useState<Artist[]>([]);
  const [songs, _setSongs] = useState<Song[]>([]);
  const [rankings, _setRankings] = useState<Ranking[]>([]);

  useEffect(() => {
    // TODO: Fetch data from your backend API
    // Example: fetch('/api/artists'), fetch('/api/songs'), fetch('/api/rankings')
  }, []);

  const artistsWithCount = useMemo(() => {
    return artists.map(artist => {
      const artistSongs = songs.filter(s => s.artistId === artist.id);
      // Calculate how many times this artist appeared in rankings (noteringen)
      const noteringen = rankings.filter(r => {
        const song = songs.find(s => s.id === r.songId);
        return song?.artistId === artist.id;
      }).length;
      
      return {
        ...artist,
        songCount: artistSongs.length,
        noteringen: noteringen
      };
    });
  }, [artists, songs, rankings]);

  const filteredAndSortedArtists = useMemo(() => {
    let filtered = artistsWithCount;
    
    if (searchTerm) {
      filtered = artistsWithCount.filter(artist =>
        artist.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        return b.songCount - a.songCount;
      }
    });

    return sorted;
  }, [artistsWithCount, searchTerm, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-12 bg-gradient-to-b from-[var(--color-gray-dark)] to-[var(--color-gray-medium)]"></div>
          <h1>Alle Artiesten in de TOP 2000</h1>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">
                <Search size={16} className="inline mr-2" />
                Zoeken op naam
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Typ om te zoeken..."
                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-[var(--color-gray-medium)]"
              />
            </div>

            <div>
              <label className="block mb-2">
                Sorteren op
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-[var(--color-gray-medium)]"
              >
                <option value="name">Naam (A-Z)</option>
                <option value="count">Aantal nummers</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 text-gray-600">
          {filteredAndSortedArtists.length} {filteredAndSortedArtists.length === 1 ? 'artiest' : 'artiesten'} gevonden
        </div>

        {/* Artists grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedArtists.map(artist => (
            <div
              key={artist.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-grow">
                    <button
                      onClick={() => onNavigate('artist-detail', { artistId: artist.id })}
                      className="hover:text-[var(--color-gray-medium)] transition-colors text-left mb-2"
                    >
                      <h3>{artist.name}</h3>
                    </button>
                    {artist.bio && (
                      <p className="text-gray-600 text-sm line-clamp-2">{artist.bio}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => onNavigate('artist-songs', { artistId: artist.id })}
                      className="flex items-center gap-2 text-[var(--color-gray-dark)] hover:text-[var(--color-gray-medium)] transition-colors"
                    >
                      <Music size={18} />
                      <span>{artist.songCount} {artist.songCount === 1 ? 'nummer' : 'nummers'}</span>
                    </button>
                    <div className="text-sm text-gray-600 ml-7">
                      {artist.noteringen} {artist.noteringen === 1 ? 'notering' : 'noteringen'}
                    </div>
                  </div>
                  <button
                    onClick={() => onNavigate('artist-detail', { artistId: artist.id })}
                    className="text-sm text-gray-600 hover:text-[var(--color-gray-medium)] transition-colors"
                  >
                    Meer info →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAndSortedArtists.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center text-gray-500">
            Geen artiesten gevonden voor deze zoekopdracht
          </div>
        )}
      </div>
    </div>
  );
}