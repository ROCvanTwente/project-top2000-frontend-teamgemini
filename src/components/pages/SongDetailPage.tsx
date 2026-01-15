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

interface ArtistSong {
  songId: number;
  title: string;
  artist: string;
  releaseYear: number | null;
  timesListed: number;
  highestPosition: number | null;
  youtubeLink?: string;
}

interface SongApi {
  songId: number;
  title: string;
  artist: string;
  artistId?: number;
  releaseYear: number | null;
  timesListed: number;
  highestPosition: number | null;
  youtubeLink?: string;
  rankings?: Ranking[];
}

interface SongDetailPageProps {
  songId: string;
  onNavigate: (page: string, params?: any) => void;
}

export function SongDetailPage({ songId, onNavigate }: SongDetailPageProps) {
  const [song, setSong] = useState<SongApi | null>(null);
  const [artistSongs, setArtistSongs] = useState<ArtistSong[]>([]);
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
        const data: SongApi = await fetchFromAPI(`songs/${songId}`);
        setSong(data);
        
        // Try to find the artist by name and get their songs
        try {
          const allArtists = await fetchFromAPI('artist');
          const artist = allArtists.find((a: any) => a.name === data.artist);
          
          if (artist) {
            const artistSongsData: ArtistSong[] = await fetchFromAPI(`api/artist/${artist.artistId}/songs`);
            // Filter to only include songs that are in the Top 2000 and exclude the current song
            const top2000Songs = artistSongsData.filter(s => s.timesListed > 0 && s.songId !== data.songId);
            setArtistSongs(top2000Songs);
          }
        } catch (artistErr) {
          // If artist songs fail to load, continue without them
          console.warn('Failed to load artist songs:', artistErr);
          setArtistSongs([]);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadSong();
  }, [songId]);

  if (loading) return <div className="text-center py-20">Laden…</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!song) return (
    <div className="min-h-screen bg-gray-50 py-12 text-center">
      <h2>Nummer niet gevonden</h2>
      <button onClick={() => onNavigate('songs')} className="mt-4 text-[var(--bright-blue)] hover:underline">
        Terug naar overzicht
      </button>
    </div>
  );

  const handleAddToPlaylist = (playlistId: string) => {
    const success = addSongToPlaylist(playlistId, song.songId.toString());
    alert(success ? 'Nummer toegevoegd aan afspeellijst!' : 'Dit nummer staat al in deze afspeellijst');
    setShowPlaylistMenu(false);
  };

  const songRankings = song.rankings?.sort((a: Ranking, b: Ranking) => b.year - a.year) || [];
  const maxPosition = songRankings.length > 0 ? Math.max(...songRankings.map((r: Ranking) => r.position)) : 2000;
  const chartWidth = 600;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">

        <button
          onClick={() => onNavigate('songs')}
          className="flex items-center gap-2 text-[var(--bright-blue)] hover:text-[var(--vivid-purple)] transition-colors mb-8"
        >
          <ArrowLeft size={20} /> Terug naar alle nummers
        </button>

        {/* Song Info */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="md:flex">
            {/* Album Cover */}
            <div className="md:w-1/3 bg-gradient-to-br from-[var(--bright-blue)] to-[var(--vivid-purple)] aspect-square flex items-center justify-center">
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
                  <p className="text-xl text-[var(--bright-blue)]">{song.artist}</p>
                </div>

                {user && (
                  <div className="relative">
                    <button
                      onClick={() => setShowPlaylistMenu(!showPlaylistMenu)}
                      className="flex items-center gap-2 px-4 py-2 bg-[var(--bright-blue)] text-white rounded-lg hover:bg-[var(--vivid-purple)] transition-colors"
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
                  <div className="text-2xl text-[var(--bright-blue)]">{song.releaseYear ?? '-'}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <TrendingUp size={18} /> <span className="text-sm">Noteringen</span>
                  </div>
                  <div className="text-2xl text-[var(--vivid-purple)]">{song.timesListed}x</div>
                </div>
              </div>

              {song.youtubeLink && (
                <a
                  href={song.youtubeLink}
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
              <div className="min-w-[600px]">
                <svg width="100%" height="300">
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
                        <circle cx={x} cy={y} r={5} fill="#2B6BE4"/>
                        <text x={x} y={280} textAnchor="middle" className="text-xs fill-gray-700">{r.year}</text>
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
                          <span className="inline-flex items-center justify-center w-12 h-8 bg-[var(--bright-blue)] text-white rounded">{r.position}</span>
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

        {/* Other Top 2000 Songs by Same Artist */}
        {artistSongs.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-[var(--vivid-purple)] to-[var(--bright-blue)]"></div>
              <h2>Andere Top 2000 nummers van {song.artist}</h2>
              <span className="px-3 py-1 bg-[var(--vivid-purple)] text-white rounded-full text-sm">
                {artistSongs.length}
              </span>
            </div>

            {/* Chart showing all artist's Top 2000 songs */}
            <div className="mb-8 overflow-x-auto">
              <div className="min-w-[800px]">
                <svg width="100%" height="400">
                  {/* Grid lines */}
                  {[0, 500, 1000, 1500, 2000].map(pos => (
                    <g key={pos}>
                      <line x1="80" y1={40 + (pos / 2000) * 300} x2="780" y2={40 + (pos / 2000) * 300} stroke="#e5e7eb" strokeWidth="1"/>
                      <text x="70" y={45 + (pos / 2000) * 300} textAnchor="end" className="text-xs fill-gray-500">{pos}</text>
                    </g>
                  ))}

                  {/* Current song bar (highlighted) */}
                  {song.highestPosition && (
                    <g>
                      <rect
                        x="100"
                        y={40 + (song.highestPosition / 2000) * 300}
                        width="40"
                        height="20"
                        fill="#2B6BE4"
                        rx="4"
                      />
                      <text
                        x="120"
                        y={55 + (song.highestPosition / 2000) * 300}
                        textAnchor="middle"
                        className="text-xs fill-white font-medium"
                      >
                        {song.highestPosition}
                      </text>
                      <text
                        x="120"
                        y={375}
                        textAnchor="middle"
                        className="text-xs fill-gray-700 font-medium"
                      >
                        {song.title.length > 15 ? song.title.substring(0, 15) + '...' : song.title}
                      </text>
                      <text
                        x="120"
                        y={387}
                        textAnchor="middle"
                        className="text-xs fill-blue-600 font-bold"
                      >
                        (Huidige)
                      </text>
                    </g>
                  )}

                  {/* Other songs bars */}
                  {artistSongs.map((song, i) => {
                    const x = 160 + i * 60;
                    const y = song.highestPosition ? 40 + (song.highestPosition / 2000) * 300 : 340;
                    return (
                      <g key={song.songId}>
                        <rect
                          x={x}
                          y={y}
                          width="40"
                          height="20"
                          fill="#552EA8"
                          rx="4"
                          className="hover:fill-opacity-80 cursor-pointer"
                          onClick={() => onNavigate('song-detail', { songId: song.songId.toString() })}
                        />
                        <text
                          x={x + 20}
                          y={y + 15}
                          textAnchor="middle"
                          className="text-xs fill-white font-medium pointer-events-none"
                        >
                          {song.highestPosition}
                        </text>
                        <text
                          x={x + 20}
                          y={375}
                          textAnchor="middle"
                          className="text-xs fill-gray-700"
                        >
                          {song.title.length > 10 ? song.title.substring(0, 10) + '...' : song.title}
                        </text>
                      </g>
                    );
                  })}

                  {/* Y-axis label */}
                  <text
                    x="20"
                    y="200"
                    textAnchor="middle"
                    transform="rotate(-90 20 200)"
                    className="text-sm fill-gray-600 font-medium"
                  >
                    Beste positie in Top 2000
                  </text>
                </svg>
              </div>
            </div>

            {/* Table with other songs */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Titel</th>
                    <th className="px-4 py-3 text-left">Beste positie</th>
                    <th className="px-4 py-3 text-left">Noteringen</th>
                    <th className="px-4 py-3 text-left">Acties</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {artistSongs
                    .sort((a, b) => (a.highestPosition || 2000) - (b.highestPosition || 2000))
                    .map((song) => (
                    <tr key={song.songId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{song.title}</div>
                        {song.releaseYear && (
                          <div className="text-sm text-gray-500">{song.releaseYear}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center justify-center w-12 h-8 bg-[var(--vivid-purple)] text-white rounded">
                          {song.highestPosition}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[var(--bright-blue)]">{song.timesListed}x</span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => onNavigate('song-detail', { songId: song.songId.toString() })}
                          className="text-[var(--bright-blue)] hover:text-[var(--vivid-purple)] transition-colors text-sm"
                        >
                          Bekijk details →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
