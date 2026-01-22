import { useEffect, useState } from 'react';
import { ArrowLeft, Play, Plus, Calendar, TrendingUp, ExternalLink } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { usePlaylist } from '../../contexts/PlaylistContext';
// @ts-ignore
import { fetchFromAPI } from '../../api.js';

interface Ranking {
  year: number;
  position: number;
}

interface SongApi {
  songId: number;
  title: string;
  artist: string;
  releaseYear: number | null;
  imgUrl?: string;
  youtube?: string;
  lyrics?: string;
  stats: {
    timesListed: number;
    highestPosition: number | null;
    firstYear?: number;
    lastYear?: number;
  };
  top2000Positions?: Ranking[] | { $values?: Ranking[] };
  Top2000Positions?: Ranking[] | { $values?: Ranking[] };
}

interface SongDetailPageProps {
  songId: string;
  onNavigate: (page: string, params?: any) => void;
}

export function SongDetailPage({ songId, onNavigate }: SongDetailPageProps) {
  const [song, setSong] = useState<SongApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);

  const { user } = useAuth();
  const { playlists, addSongToPlaylist } = usePlaylist();

  useEffect(() => {
    const loadSong = async () => {
      try {
        setLoading(true);
        setError(null);
        const data: any = await fetchFromAPI(`songs/${songId}`);
        setSong(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadSong();
  }, [songId]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mx-auto mb-4 w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-red-500/30"></div>
            <div className="absolute inset-0 rounded-full border-4 border-red-600 border-t-transparent animate-spin"></div>
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Laden...</h2>
          <p className="text-white/80">Even geduld</p>
          <div className="mt-4 flex items-center justify-center gap-1">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></span>
            <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }}></span>
            <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></span>
          </div>
        </div>
      </div>
    );
  }

  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!song) return (
    <div className="min-h-screen bg-gray-50 py-12 text-center">
      <h2>Nummer niet gevonden</h2>
      <button onClick={() => onNavigate('songs')} className="mt-4 text-(--bright-blue) hover:underline">
        Terug naar overzicht
      </button>
    </div>
  );

  const handleAddToPlaylist = (playlistId: string) => {
    const success = addSongToPlaylist(playlistId, song.songId.toString());
    alert(success ? 'Nummer toegevoegd aan afspeellijst!' : 'Dit nummer staat al in deze afspeellijst');
    setShowPlaylistMenu(false);
  };

  // ✅ Zorg dat rawRankings altijd een echte array is
  const rawRankings: Ranking[] = Array.isArray(song.top2000Positions)
    ? song.top2000Positions
    : Array.isArray(song.Top2000Positions)
      ? song.Top2000Positions
      : song.top2000Positions?.$values
        ?? song.Top2000Positions?.$values
        ?? [];

  // Sorteer descending op jaar
  const songRankings = rawRankings.sort((a: Ranking, b: Ranking) => b.year - a.year);

  const maxPosition = songRankings.length > 0 ? Math.max(...songRankings.map(r => r.position)) : 2000;
  const chartWidth = Math.max(800, songRankings.length * 80);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">

        <button
          onClick={() => onNavigate('songs')}
          className="flex items-center gap-2 text-(--bright-blue) hover:text-(--vivid-purple) transition-colors mb-8"
        >
          <ArrowLeft size={20} /> Terug naar alle nummers
        </button>

        {/* Song Info */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="md:flex">
            {/* Album Cover */}
            <div className="md:w-1/3 bg-linear-to-br from-(--bright-blue) to-(--vivid-purple) aspect-square flex items-center justify-center">
              <div className="text-white text-center p-8">
                <Play size={80} className="mx-auto mb-4" />
                <h2 className="text-white mb-2">{song.title}</h2>
                <p className="text-white/80">{song.artist}</p>
              </div>
            </div>

            {/* Song Details */}
            <div className="md:w-2/3 p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="mb-2">{song.title}</h1>
                  <p className="text-xl text-(--bright-blue)">{song.artist}</p>
                </div>

                {user && (
                  <div className="relative">
                    <button
                      onClick={() => setShowPlaylistMenu(!showPlaylistMenu)}
                      className="flex items-center gap-2 px-4 py-2 bg-(--bright-blue) text-white rounded-lg hover:bg-(--vivid-purple) transition-colors"
                    >
                      <Plus size={18} /> Toevoegen aan lijst
                    </button>
                    {showPlaylistMenu && (
                      <div className="absolute right-0 top-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl py-2 min-w-[200px] z-10">
                        {playlists.length === 0 ? (
                          <div className="px-4 py-2 text-gray-500 text-sm">Geen afspeellijsten</div>
                        ) : (
                          playlists.map(pl => (
                            <button
                              key={pl.id}
                              onClick={() => handleAddToPlaylist(pl.id)}
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                            >
                              {pl.name}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Calendar size={18} /> <span className="text-sm">Uitgegeven</span>
                  </div>
                  <div className="text-2xl text-(--bright-blue)">{song.releaseYear ?? '-'}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <TrendingUp size={18} /> <span className="text-sm">Noteringen</span>
                  </div>
                  <div className="text-2xl text-[var(--vivid-purple)]">{song.stats?.timesListed || (song as any).Stats?.TimesListed || 0}x</div>
                </div>
              </div>

              {(song.youtube || (song as any).Youtube) && (
                <a
                  href={song.youtube || (song as any).Youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <ExternalLink size={20} /> Beluister op YouTube
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Rankings */}
        {songRankings.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="mb-6">Noteringen door de jaren</h2>

            {/* Chart */}
            <div className="mb-8 overflow-x-auto">
              <div style={{ minWidth: `${chartWidth}px` }}>
                <svg width="100%" height="300" viewBox={`0 0 ${chartWidth} 300`}>
                  {[0, 500, 1000, 1500, 2000].map(pos => (
                    <g key={pos}>
                      <line x1="60" y1={40 + (pos / maxPosition) * 220} x2={chartWidth} y2={40 + (pos / maxPosition) * 220} stroke="#e5e7eb" strokeWidth="1"/>
                      <text x="45" y={45 + (pos / maxPosition) * 220} textAnchor="end" className="text-xs fill-gray-500">{pos}</text>
                    </g>
                  ))}

                  <polyline
                    points={songRankings.map((r: Ranking, i: number) => {
                      const x = 60 + (i/(songRankings.length-1||1))*(chartWidth-80);
                      const y = 40 + (r.position/maxPosition)*220;
                      return `${x},${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                  />

                  {songRankings.map((r: Ranking, i: number) => {
                    const x = 60 + (i/(songRankings.length-1||1))*(chartWidth-80);
                    const y = 40 + (r.position/maxPosition)*220;
                    return (
                      <g key={r.year}>
                        <circle cx={x} cy={y} r={6} fill="#2B6BE4"/>
                        {/* Year label at the bottom */}
                        <text 
                          x={x} 
                          y={280} 
                          textAnchor="middle" 
                          className="text-xs fill-gray-700"
                          transform={songRankings.length > 10 ? `rotate(-45 ${x} 280)` : undefined}
                        >
                          {r.year}
                        </text>
                      </g>
                    );
                  })}

                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#2B6BE4"/>
                      <stop offset="100%" stopColor="#552EA8"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Jaar</th>
                    <th className="px-4 py-3 text-left">Positie</th>
                    <th className="px-4 py-3 text-left">Verandering</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {songRankings.map((r: Ranking, i: number)=>{
                    const prev = songRankings[i+1];
                    const change = prev ? prev.position - r.position : null;
                    return (
                      <tr key={r.year}>
                        <td className="px-4 py-3">{r.year}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center justify-center w-12 h-8 bg-(--bright-blue) text-white rounded">{r.position}</span>
                        </td>
                        <td className="px-4 py-3">
                          {change!==null && (
                            <span className={change>0?'text-green-600':change<0?'text-red-600':'text-gray-500'}>
                              {change>0?`↑ ${change}`:change<0?`↓ ${Math.abs(change)}`:'–'}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}