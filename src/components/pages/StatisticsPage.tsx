import { useState, useMemo } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { songs, artists, rankings } from '../../data/mockData';

interface StatisticsPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export function StatisticsPage({ onNavigate: _onNavigate }: StatisticsPageProps) {
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [topArtistsCount, setTopArtistsCount] = useState<number>(3);
  const [selectedStatistic, setSelectedStatistic] = useState<string>('fallers');

  // Get available years
  const availableYears = useMemo(() => {
    return Array.from(new Set(rankings.map(r => r.year))).sort((a, b) => b - a);
  }, []);

  // 1. Dalers (Fallers)
  const fallers = useMemo(() => {
    const currentYearRankings = rankings.filter(r => r.year === selectedYear);
    const previousYear = selectedYear - 1;
    const previousYearRankings = rankings.filter(r => r.year === previousYear);

    return currentYearRankings
      .map(current => {
        const previous = previousYearRankings.find(p => p.songId === current.songId);
        if (previous && current.position > previous.position) {
          const song = songs.find(s => s.id === current.songId);
          const artist = artists.find(a => a.id === song?.artistId);
          return {
            position: current.position,
            title: song?.title || '',
            artist: artist?.name || '',
            releaseYear: song?.releaseYear || 0,
            drop: current.position - previous.position,
            previousPosition: previous.position
          };
        }
        return null;
      })
      .filter(Boolean)
      .sort((a, b) => (b?.drop || 0) - (a?.drop || 0));
  }, [selectedYear]);

  // 2. Stijgers (Risers)
  const risers = useMemo(() => {
    const currentYearRankings = rankings.filter(r => r.year === selectedYear);
    const previousYear = selectedYear - 1;
    const previousYearRankings = rankings.filter(r => r.year === previousYear);

    return currentYearRankings
      .map(current => {
        const previous = previousYearRankings.find(p => p.songId === current.songId);
        if (previous && current.position < previous.position) {
          const song = songs.find(s => s.id === current.songId);
          const artist = artists.find(a => a.id === song?.artistId);
          return {
            position: current.position,
            title: song?.title || '',
            artist: artist?.name || '',
            releaseYear: song?.releaseYear || 0,
            rise: previous.position - current.position,
            previousPosition: previous.position
          };
        }
        return null;
      })
      .filter(Boolean)
      .sort((a, b) => (b?.rise || 0) - (a?.rise || 0));
  }, [selectedYear]);

  // 3. Altijd in de lijst (Always in the list)
  const alwaysInList = useMemo(() => {
    const allYears = Array.from(new Set(rankings.map(r => r.year)));
    
    return songs
      .filter(song => {
        // Check if song appears in all years
        return allYears.every(year => 
          rankings.some(r => r.year === year && r.songId === song.id)
        );
      })
      .map(song => {
        const artist = artists.find(a => a.id === song.artistId);
        return {
          title: song.title,
          artist: artist?.name || ''
        };
      })
      .sort((a, b) => a.title.localeCompare(b.title));
  }, []);

  // 4. Nieuw binnengekomen (New entries)
  const newEntries = useMemo(() => {
    const currentYearRankings = rankings.filter(r => r.year === selectedYear);
    const previousYear = selectedYear - 1;
    const previousYearSongIds = new Set(
      rankings.filter(r => r.year === previousYear).map(r => r.songId)
    );

    return currentYearRankings
      .filter(r => !previousYearSongIds.has(r.songId))
      .map(r => {
        const song = songs.find(s => s.id === r.songId);
        const artist = artists.find(a => a.id === song?.artistId);
        return {
          position: r.position,
          title: song?.title || '',
          artist: artist?.name || '',
          releaseYear: song?.releaseYear || 0
        };
      })
      .sort((a, b) => a.position - b.position);
  }, [selectedYear]);

  // 5. Verdwenen (Disappeared)
  const disappeared = useMemo(() => {
    const currentYearSongIds = new Set(
      rankings.filter(r => r.year === selectedYear).map(r => r.songId)
    );
    const previousYear = selectedYear - 1;
    const previousYearRankings = rankings.filter(r => r.year === previousYear);

    return previousYearRankings
      .filter(r => !currentYearSongIds.has(r.songId))
      .map(r => {
        const song = songs.find(s => s.id === r.songId);
        const artist = artists.find(a => a.id === song?.artistId);
        return {
          position: r.position,
          title: song?.title || '',
          artist: artist?.name || '',
          releaseYear: song?.releaseYear || 0
        };
      })
      .sort((a, b) => a.position - b.position);
  }, [selectedYear]);

  // 6. Opnieuw binnengekomen (Re-entries)
  const reEntries = useMemo(() => {
    const currentYearRankings = rankings.filter(r => r.year === selectedYear);
    const previousYear = selectedYear - 1;
    const previousYearSongIds = new Set(
      rankings.filter(r => r.year === previousYear).map(r => r.songId)
    );

    return currentYearRankings
      .filter(r => {
        // Not in previous year
        if (previousYearSongIds.has(r.songId)) return false;
        // But was in some year before that
        return rankings.some(ranking => 
          ranking.songId === r.songId && ranking.year < previousYear
        );
      })
      .map(r => {
        const song = songs.find(s => s.id === r.songId);
        const artist = artists.find(a => a.id === song?.artistId);
        return {
          position: r.position,
          title: song?.title || '',
          artist: artist?.name || '',
          releaseYear: song?.releaseYear || 0
        };
      })
      .sort((a, b) => a.position - b.position);
  }, [selectedYear]);

  // 7. Dezelfde plek (Same position)
  const samePosition = useMemo(() => {
    const currentYearRankings = rankings.filter(r => r.year === selectedYear);
    const previousYear = selectedYear - 1;
    const previousYearRankings = rankings.filter(r => r.year === previousYear);

    return currentYearRankings
      .map(current => {
        const previous = previousYearRankings.find(p => p.songId === current.songId);
        if (previous && current.position === previous.position) {
          const song = songs.find(s => s.id === current.songId);
          const artist = artists.find(a => a.id === song?.artistId);
          return {
            position: current.position,
            title: song?.title || '',
            artist: artist?.name || '',
            releaseYear: song?.releaseYear || 0
          };
        }
        return null;
      })
      .filter(Boolean)
      .sort((a, b) => (a?.position || 0) - (b?.position || 0));
  }, [selectedYear]);

  // 8. Artiesten op aansluitende posities (Artists on consecutive positions)
  const consecutiveArtists = useMemo(() => {
    const yearRankings = rankings
      .filter(r => r.year === selectedYear)
      .sort((a, b) => a.position - b.position);

    const results: Array<{
      position: number;
      title: string;
      artist: string;
      releaseYear: number;
    }> = [];

    for (let i = 0; i < yearRankings.length - 1; i++) {
      const current = yearRankings[i];
      const next = yearRankings[i + 1];
      
      const currentSong = songs.find(s => s.id === current.songId);
      const nextSong = songs.find(s => s.id === next.songId);

      if (currentSong?.artistId === nextSong?.artistId && current.position + 1 === next.position && currentSong && nextSong) {
        const artist = artists.find(a => a.id === currentSong.artistId);
        
        // Add current if not already in results
        if (!results.some(r => r.position === current.position)) {
          results.push({
            position: current.position,
            title: currentSong.title,
            artist: artist?.name || '',
            releaseYear: currentSong.releaseYear
          });
        }
        
        // Add next
        results.push({
          position: next.position,
          title: nextSong.title,
          artist: artist?.name || '',
          releaseYear: nextSong.releaseYear
        });
      }
    }

    return results;
  }, [selectedYear]);

  // 9. Eenmalig in de lijst (One-time entries)
  const oneTimeEntries = useMemo(() => {
    return songs
      .filter(song => {
        const appearances = rankings.filter(r => r.songId === song.id);
        return appearances.length === 1;
      })
      .map(song => {
        const artist = artists.find(a => a.id === song.artistId);
        const ranking = rankings.find(r => r.songId === song.id);
        return {
          artist: artist?.name || '',
          title: song.title,
          releaseYear: song.releaseYear,
          position: ranking?.position || 0,
          year: ranking?.year || 0
        };
      })
      .sort((a, b) => {
        const artistCompare = a.artist.localeCompare(b.artist);
        return artistCompare !== 0 ? artistCompare : a.title.localeCompare(b.title);
      });
  }, []);

  // 10. Top artiesten (Top artists)
  const topArtists = useMemo(() => {
    const yearRankings = rankings.filter(r => r.year === selectedYear);
    
    const artistStats = artists.map(artist => {
      const artistSongIds = songs
        .filter(s => s.artistId === artist.id)
        .map(s => s.id);
      
      const artistRankings = yearRankings.filter(r => 
        artistSongIds.includes(r.songId)
      );

      if (artistRankings.length === 0) return null;

      const positions = artistRankings.map(r => r.position);
      const avgPosition = positions.reduce((a, b) => a + b, 0) / positions.length;
      const highestPosition = Math.min(...positions);

      return {
        artist: artist.name,
        count: artistRankings.length,
        avgPosition: Math.round(avgPosition),
        highestPosition
      };
    }).filter(Boolean);

    // Sort by count descending, then by avg position ascending
    const sorted = artistStats.sort((a, b) => {
      if (!a || !b) return 0;
      if (b.count !== a.count) return b.count - a.count;
      return a.avgPosition - b.avgPosition;
    });

    // Get the count threshold
    const threshold = sorted[topArtistsCount - 1]?.count || 0;
    
    // Return all artists with count >= threshold
    return sorted.filter(a => a && a.count >= threshold).slice(0, topArtistsCount + 5);
  }, [selectedYear, topArtistsCount]);

  const renderContent = () => {
    switch (selectedStatistic) {
      case 'fallers':
        return (
          <div>
            <h2 className="mb-6">Dalers {selectedYear}</h2>
            <p className="text-gray-600 mb-6">
              Alle nummers die zijn gedaald ten opzichte van {selectedYear - 1}, gesorteerd op aantal plaatsen gedaald.
            </p>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Positie</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Titel</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Artiest</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Jaar</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Gedaald</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {fallers.map((item: any, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{item.position}</td>
                      <td className="px-6 py-4">{item.title}</td>
                      <td className="px-6 py-4">{item.artist}</td>
                      <td className="px-6 py-4">{item.releaseYear}</td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1 text-red-600">
                          <TrendingDown size={16} />
                          {item.drop} plaatsen
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {fallers.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  Geen dalers voor dit jaar
                </div>
              )}
            </div>
          </div>
        );

      case 'risers':
        return (
          <div>
            <h2 className="mb-6">Stijgers {selectedYear}</h2>
            <p className="text-gray-600 mb-6">
              Alle nummers die zijn gestegen ten opzichte van {selectedYear - 1}, gesorteerd op aantal plaatsen gestegen.
            </p>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Positie</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Titel</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Artiest</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Jaar</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Gestegen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {risers.map((item: any, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{item.position}</td>
                      <td className="px-6 py-4">{item.title}</td>
                      <td className="px-6 py-4">{item.artist}</td>
                      <td className="px-6 py-4">{item.releaseYear}</td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1 text-green-600">
                          <TrendingUp size={16} />
                          {item.rise} plaatsen
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {risers.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  Geen stijgers voor dit jaar
                </div>
              )}
            </div>
          </div>
        );

      case 'always':
        return (
          <div>
            <h2 className="mb-6">Altijd in de Lijst</h2>
            <p className="text-gray-600 mb-6">
              Nummers die in alle edities van de TOP 2000 hebben gestaan.
            </p>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Titel</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Artiest</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {alwaysInList.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{item.title}</td>
                      <td className="px-6 py-4">{item.artist}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {alwaysInList.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  Geen nummers die altijd in de lijst staan
                </div>
              )}
            </div>
          </div>
        );

      case 'new':
        return (
          <div>
            <h2 className="mb-6">Nieuw Binnengekomen {selectedYear}</h2>
            <p className="text-gray-600 mb-6">
              Nummers die in {selectedYear} nieuw zijn binnengekomen (niet in {selectedYear - 1}).
            </p>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Positie</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Titel</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Artiest</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Jaar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {newEntries.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{item.position}</td>
                      <td className="px-6 py-4">{item.title}</td>
                      <td className="px-6 py-4">{item.artist}</td>
                      <td className="px-6 py-4">{item.releaseYear}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {newEntries.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  Geen nieuwe binnenkomers voor dit jaar
                </div>
              )}
            </div>
          </div>
        );

      case 'disappeared':
        return (
          <div>
            <h2 className="mb-6">Verdwenen uit de Lijst {selectedYear}</h2>
            <p className="text-gray-600 mb-6">
              Nummers die in {selectedYear - 1} wel in de lijst stonden maar in {selectedYear} niet meer.
            </p>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Positie ({selectedYear - 1})</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Titel</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Artiest</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Jaar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {disappeared.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{item.position}</td>
                      <td className="px-6 py-4">{item.title}</td>
                      <td className="px-6 py-4">{item.artist}</td>
                      <td className="px-6 py-4">{item.releaseYear}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {disappeared.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  Geen verdwenen nummers voor dit jaar
                </div>
              )}
            </div>
          </div>
        );

      case 'reentry':
        return (
          <div>
            <h2 className="mb-6">Opnieuw Binnengekomen {selectedYear}</h2>
            <p className="text-gray-600 mb-6">
              Nummers die in {selectedYear} opnieuw zijn binnengekomen (niet in {selectedYear - 1}, maar wel daarvoor).
            </p>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Positie</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Titel</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Artiest</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Jaar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reEntries.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{item.position}</td>
                      <td className="px-6 py-4">{item.title}</td>
                      <td className="px-6 py-4">{item.artist}</td>
                      <td className="px-6 py-4">{item.releaseYear}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {reEntries.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  Geen opnieuw binnenkomers voor dit jaar
                </div>
              )}
            </div>
          </div>
        );

      case 'same':
        return (
          <div>
            <h2 className="mb-6">Dezelfde Positie {selectedYear}</h2>
            <p className="text-gray-600 mb-6">
              Nummers die in {selectedYear} op dezelfde positie staan als in {selectedYear - 1}.
            </p>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Positie</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Titel</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Artiest</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Jaar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {samePosition.map((item: any, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{item.position}</td>
                      <td className="px-6 py-4">{item.title}</td>
                      <td className="px-6 py-4">{item.artist}</td>
                      <td className="px-6 py-4">{item.releaseYear}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {samePosition.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  Geen nummers op dezelfde positie
                </div>
              )}
            </div>
          </div>
        );

      case 'consecutive':
        return (
          <div>
            <h2 className="mb-6">Artiesten op Aansluitende Posities {selectedYear}</h2>
            <p className="text-gray-600 mb-6">
              Artiesten met 2 of meer nummers op aansluitende posities in {selectedYear}.
            </p>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Positie</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Titel</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Artiest</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Jaar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {consecutiveArtists.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{item.position}</td>
                      <td className="px-6 py-4">{item.title}</td>
                      <td className="px-6 py-4">{item.artist}</td>
                      <td className="px-6 py-4">{item.releaseYear}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {consecutiveArtists.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  Geen artiesten op aansluitende posities
                </div>
              )}
            </div>
          </div>
        );

      case 'onetime':
        return (
          <div>
            <h2 className="mb-6">Eenmalig in de Lijst</h2>
            <p className="text-gray-600 mb-6">
              Nummers die slechts één keer in de TOP 2000 hebben gestaan.
            </p>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Artiest</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Titel</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Jaar</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Positie</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">TOP2000 Jaar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {oneTimeEntries.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{item.artist}</td>
                      <td className="px-6 py-4">{item.title}</td>
                      <td className="px-6 py-4">{item.releaseYear}</td>
                      <td className="px-6 py-4">{item.position}</td>
                      <td className="px-6 py-4">{item.year}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {oneTimeEntries.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  Geen eenmalige nummers
                </div>
              )}
            </div>
          </div>
        );

      case 'topartists':
        return (
          <div>
            <h2 className="mb-6">Top Artiesten {selectedYear}</h2>
            <p className="text-gray-600 mb-6">
              Artiesten met de meeste nummers in {selectedYear}.
            </p>
            <div className="mb-6 bg-white rounded-lg shadow-md p-4">
              <label className="block mb-2">Aantal top artiesten:</label>
              <input
                type="number"
                min="1"
                max="10"
                value={topArtistsCount}
                onChange={(e) => setTopArtistsCount(Math.max(1, parseInt(e.target.value) || 3))}
                className="border-2 border-gray-200 rounded-lg p-2 w-32"
              />
            </div>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Artiest</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Aantal Nummers</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Gem. Positie</th>
                    <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Hoogste Notering</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {topArtists.map((item: any, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{item.artist}</td>
                      <td className="px-6 py-4">{item.count}</td>
                      <td className="px-6 py-4">{item.avgPosition}</td>
                      <td className="px-6 py-4">{item.highestPosition}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {topArtists.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  Geen artiesten voor dit jaar
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-12 bg-gradient-to-b from-[var(--color-gray-dark)] to-[var(--color-gray-medium)]"></div>
          <h1>Statistieken TOP 2000</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <p className="text-gray-700 mb-6">
            De statistieken van de TOP 2000 bieden een schat aan informatie voor zowel liefhebbers als onderzoekers van de Nederlandse popmuziekgeschiedenis. Op deze pagina vind je diverse overzichten die inzicht geven in trends en ontwikkelingen binnen de lijst door de jaren heen.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Selecteer jaar:</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-[var(--color-gray-medium)]"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2">Selecteer statistiek:</label>
              <select
                value={selectedStatistic}
                onChange={(e) => setSelectedStatistic(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-[var(--color-gray-medium)]"
              >
                <option value="fallers">Dalers</option>
                <option value="risers">Stijgers</option>
                <option value="always">Altijd in de lijst</option>
                <option value="new">Nieuw binnengekomen</option>
                <option value="disappeared">Verdwenen</option>
                <option value="reentry">Opnieuw binnengekomen</option>
                <option value="same">Dezelfde positie</option>
                <option value="consecutive">Artiesten op aansluitende posities</option>
                <option value="onetime">Eenmalig in de lijst</option>
                <option value="topartists">Top artiesten</option>
              </select>
            </div>
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}
