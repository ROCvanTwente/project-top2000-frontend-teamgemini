import { useState, useMemo } from 'react';
import { Search, Filter } from 'lucide-react';
import { songs, artists, rankings } from '../../data/mockData';

interface RankingsPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export function RankingsPage({ onNavigate }: RankingsPageProps) {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'position' | 'artist' | 'title'>('position');

  const availableYears = useMemo(() => {
    return [...new Set(rankings.map(r => r.year))].sort((a, b) => b - a);
  }, []);

  const yearRankings = useMemo(() => {
    const yearData = rankings
      .filter(r => r.year === selectedYear)
      .map(ranking => {
        const song = songs.find(s => s.id === ranking.songId);
        const artist = song ? artists.find(a => a.id === song.artistId) : null;
        return { ranking, song, artist };
      })
      .filter(item => item.song && item.artist);

    // Apply search filter
    let filtered = yearData;
    if (searchTerm) {
      filtered = yearData.filter(item =>
        item.song!.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.artist!.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'position') {
        return a.ranking.position - b.ranking.position;
      } else if (sortBy === 'artist') {
        return a.artist!.name.localeCompare(b.artist!.name);
      } else {
        return a.song!.title.localeCompare(b.song!.title);
      }
    });

    return sorted;
  }, [selectedYear, searchTerm, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-12 bg-black"></div>
          <h1>TOP 2000 Jaaroverzichten</h1>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Year selector */}
            <div>
              <label className="block mb-2">
                <Filter size={16} className="inline mr-2" />
                Jaar
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-black"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block mb-2">
                <Search size={16} className="inline mr-2" />
                Zoeken op artiest of titel
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Typ om te zoeken..."
                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-black"
              />
            </div>

            {/* Sort */}
            <div>
              <label className="block mb-2">
                Sorteren op
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-black"
              >
                <option value="position">Positie</option>
                <option value="artist">Artiest</option>
                <option value="title">Titel</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-4 text-gray-600">
          {yearRankings.length} {yearRankings.length === 1 ? 'nummer' : 'nummers'} gevonden
        </div>

        {/* Rankings list */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black text-white">
                <tr>
                  <th className="px-6 py-4 text-left w-20">Positie</th>
                  <th className="px-6 py-4 text-left">Titel</th>
                  <th className="px-6 py-4 text-left">Artiest</th>
                  <th className="px-6 py-4 text-left w-32">Jaar</th>
                </tr>
              </thead>
              <tbody>
                {yearRankings.map(({ ranking, song, artist }) => (
                  <tr
                    key={ranking.songId}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center text-white">
                        {ranking.position}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onNavigate('song-detail', { songId: song!.id })}
                        className="hover:underline transition-colors text-left"
                      >
                        {song!.title}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onNavigate('artist-detail', { artistId: artist!.id })}
                        className="hover:underline transition-colors text-left"
                      >
                        {artist!.name}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {song!.releaseYear}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {yearRankings.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Geen resultaten gevonden voor deze zoekopdracht
            </div>
          )}
        </div>
      </div>
    </div>
  );
}