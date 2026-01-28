import { useEffect, useState, useRef } from 'react';
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
  spotify?: string;
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
  const [imageError, setImageError] = useState(false);
  const { user } = useAuth();
  const { playlists, addSongToPlaylist } = usePlaylist();
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowPlaylistMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

const handleAddToPlaylist = async (playlistId: string) => {
  if (!song) return;

  const playlist = playlists.find(p => p.id === playlistId);
  const playlistName = playlist ? playlist.name : 'afspeellijst';

  const success = await addSongToPlaylist(playlistId, song.songId.toString(), song.title, song.artist);

  if (success) {
    setToast({ type: 'success', message: `🎵 "${song.title}" toegevoegd aan playlist "${playlistName}"!` });
  } else {
    setToast({ type: 'error', message: `⚠️ Nummer staat al in playlist "${playlistName}"` });
  }

  setShowPlaylistMenu(false);
  setTimeout(() => setToast(null), 3000);
};

  useEffect(() => {
    const loadSong = async () => {
      try {
        setLoading(true);
        setError(null);
        const data: any = await fetchFromAPI(`songs/${songId}`);
        console.log('API /songs/' + songId + ' response:', data); // <-- added
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
            <span
              className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.15s" }}
            ></span>
            <span
              className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.3s" }}
            ></span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!song) return (
    <div className="min-h-screen bg-gray-50 py-12 text-center">
      <h2>Nummer niet gevonden</h2>
      <button onClick={() => onNavigate('songs')} className="mt-4 text-blue-500 hover:underline">
        Terug naar overzicht
      </button>
    </div>
  );

  const rawRankings: Ranking[] =
    Array.isArray(song.top2000Positions)
      ? song.top2000Positions
      : Array.isArray(song.Top2000Positions)
        ? song.Top2000Positions
        : song.top2000Positions?.$values ?? song.Top2000Positions?.$values ?? [];

  const songRankings = rawRankings.sort((a: Ranking, b: Ranking) => b.year - a.year);
  const maxPosition = songRankings.length > 0 ? Math.max(...songRankings.map(r => r.position)) : 2000;
  const chartWidth = Math.max(800, songRankings.length * 80);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">

        {/* Toast melding */}
        {toast && (
          <div className={`fixed top-4 right-4 p-4 rounded-lg text-white shadow-lg z-50 ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
            {toast.message}
          </div>
        )}

        <button onClick={() => onNavigate('songs')} className="flex items-center gap-2 text-[var(--bright-blue)] hover:text-[var(--vivid-purple)] transition-colors mb-8">
          <ArrowLeft size={20} /> Terug naar alle nummers
        </button>

        {/* Song Info */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="md:flex">

            {/* Album Cover */}
            <div className="md:w-1/3 bg-gradient-to-br from-[var(--bright-blue)] to-[var(--vivid-purple)] aspect-square flex items-center justify-center overflow-hidden">
              {song.imgUrl && !imageError ? (
                <img 
                  src={song.imgUrl} 
                  alt={`${song.title} cover`} 
                  className="object-cover w-full h-full"
                  onError={() => {
                    console.warn('Image failed to load:', song.imgUrl);
                    setImageError(true);
                  }}
                />
              ) : (
                <div className="text-white text-center p-8">
                  <Play size={80} className="mx-auto mb-4" />
                  <h2 className="text-white mb-2">{song.title}</h2>
                  <p className="text-white/80">{song.artist}</p>
                </div>
              )}
            </div>

            {/* Song Details */}
            <div className="md:w-2/3 p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="mb-6">
                  <h1 className="mb-2">{song.title}</h1>
                  <p className="text-xl">{song.artist}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Calendar size={18} />
                    <span className="text-sm">Uitgegeven</span>
                  </div>
                  <div className="text-2xl text-[var(--bright-blue)]">{song.releaseYear ?? '-'}</div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <TrendingUp size={18} />
                    <span className="text-sm">Noteringen</span>
                  </div>
                  <div className="text-2xl text-[var(--vivid-purple)]">{song.stats?.timesListed || 0}x</div>
                </div>
              </div>

              {/* KNOP MET DROPDOWN */}
              <div className="mb-6 relative" ref={dropdownRef}>
<button
  onClick={() => {
    if (!user) {
      // redirect naar login als niet ingelogd
      onNavigate('login');
    } else {
      // toggle dropdown als ingelogd
      setShowPlaylistMenu(prev => !prev);
    }
  }}
  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
>
  <Plus size={16} /> Toevoegen aan lijst
</button>
                {showPlaylistMenu && (
                  <div className="absolute mt-2 w-48 bg-white shadow-lg rounded-lg z-50">
                    {playlists.map(p => (
                      <button
                        key={p.id}
                        onClick={() => handleAddToPlaylist(p.id)}
                        className="w-full text-left px-4 py-2 hover:bg-red-500"
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {(song.youtube) && (
                <a
                  href={song.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <ExternalLink size={20} /> Beluister op YouTube
                </a>
              )}
              {song.lyrics && (
                <button
                  onClick={() => {
                    // Handle lyrics display - you can navigate to a lyrics page or show a modal
                    alert(song.lyrics);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-md hover:shadow-lg transform hover:scale-105 ml-4"
                >
                  <ExternalLink size={20} /> Tekst
                </button>
              )}
              {song.spotify && (
                <a
                  href={song.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                >
                  <ExternalLink size={20} /> Beluister op Spotify
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
                      <line
                        x1="60"
                        y1={40 + (pos / maxPosition) * 220}
                        x2={chartWidth}
                        y2={40 + (pos / maxPosition) * 220}
                        stroke="#e5e7eb"
                        strokeWidth="1"
                      />
                      <text
                        x="45"
                        y={45 + (pos / maxPosition) * 220}
                        textAnchor="end"
                        className="text-xs fill-gray-500"
                      >
                        {pos}
                      </text>
                    </g>
                  ))}
                  <polyline
                    points={songRankings.map((r: Ranking, i: number) => {
                      const x = 60 + (i / (songRankings.length - 1 || 1)) * (chartWidth - 80);
                      const y = 40 + (r.position / maxPosition) * 220;
                      return `${x},${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                  />
                  {songRankings.map((r: Ranking, i: number) => {
                    const x = 60 + (i / (songRankings.length - 1 || 1)) * (chartWidth - 80);
                    const y = 40 + (r.position / maxPosition) * 220;
                    return (
                      <g key={r.year}>
                        <circle cx={x} cy={y} r={6} fill="#2B6BE4" />
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
                      <stop offset="0%" stopColor="#2B6BE4" />
                      <stop offset="100%" stopColor="#552EA8" />
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
                  {songRankings.map((r: Ranking, i: number) => {
                    const prev = songRankings[i + 1];
                    const change = prev ? prev.position - r.position : null;
                    return (
                      <tr key={r.year}>
                        <td className="px-4 py-3">{r.year}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center justify-center w-12 h-8 bg-[var(--bright-blue)] text-white rounded">
                            {r.position}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {change !== null && (
                            <span className={change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-500'}>
                              {change > 0 ? `↑ ${change}` : change < 0 ? `↓ ${Math.abs(change)}` : '–'}
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