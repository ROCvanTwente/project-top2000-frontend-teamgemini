import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Plus, Calendar, TrendingUp } from 'lucide-react';
import type { Song, Artist, Ranking, Playlist } from '../../types';

interface SongDetailPageProps {
  songId: string;
  onNavigate: (page: string, params?: any) => void;
}

export function SongDetailPage({ songId, onNavigate }: SongDetailPageProps) {
  const [song, _setSong] = useState<Song | null>(null);
  const [artist, _setArtist] = useState<Artist | null>(null);
  const [songRankings, _setSongRankings] = useState<Ranking[]>([]);

  useEffect(() => {
    // TODO: Fetch song, artist, and rankings data from your backend API
    // Example:
    // const fetchData = async () => {
    //   const songRes = await fetch(`/api/songs/${songId}`);
    //   const songData = await songRes.json();
    //   setSong(songData);
    //   const artistRes = await fetch(`/api/artists/${songData.artistId}`);
    //   const artistData = await artistRes.json();
    //   setArtist(artistData);
    //   const rankingsRes = await fetch(`/api/rankings?songId=${songId}`);
    //   const rankingsData = await rankingsRes.json();
    //   setSongRankings(rankingsData.sort((a, b) => b.year - a.year));
    // };
    // fetchData();
  }, [songId]);
  
  // TODO: Implement user state management with your backend
  const user = null; // Replace with your authentication logic
  const playlists: Playlist[] = []; // TODO: Fetch from your backend
  const [showPlaylistMenu, setShowPlaylistMenu] = useState(false);

  if (!song || !artist) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2>Nummer niet gevonden</h2>
          <button
            onClick={() => onNavigate('songs')}
            className="mt-4 text-[var(--bright-blue)] hover:underline"
          >
            Terug naar overzicht
          </button>
        </div>
      </div>
    );
  }

  const handleAddToPlaylist = async (_playlistId: string) => {
    // TODO: Add song to playlist via your backend API
    console.warn('Add to playlist not implemented');
    alert('Afspeellijst functionaliteit is nog niet geïmplementeerd');
    setShowPlaylistMenu(false);
  };

  const maxPosition = Math.max(...songRankings.map(r => r.position));
  const chartWidth = 600;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <button
          onClick={() => onNavigate('songs')}
          className="flex items-center gap-2 text-[var(--bright-blue)] hover:text-[var(--vivid-purple)] transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Terug naar alle nummers
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="md:flex">
            {/* Album Cover Placeholder */}
            <div className="md:w-1/3 bg-gradient-to-br from-[var(--bright-blue)] to-[var(--vivid-purple)] aspect-square flex items-center justify-center">
              <div className="text-white text-center p-8">
                <Play size={80} className="mx-auto mb-4" />
                <h2 className="text-white mb-2">{song.title}</h2>
                <p className="text-white/80">{artist.name}</p>
              </div>
            </div>

            {/* Song Info */}
            <div className="md:w-2/3 p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="mb-2">{song.title}</h1>
                  <button
                    onClick={() => onNavigate('artist-detail', { artistId: artist.id })}
                    className="text-xl text-[var(--bright-blue)] hover:text-[var(--vivid-purple)] transition-colors"
                  >
                    {artist.name}
                  </button>
                </div>
                {user && (
                  <div className="relative">
                    <button
                      onClick={() => setShowPlaylistMenu(!showPlaylistMenu)}
                      className="flex items-center gap-2 px-4 py-2 bg-[var(--bright-blue)] text-white rounded-lg hover:bg-[var(--vivid-purple)] transition-colors"
                    >
                      <Plus size={18} />
                      Toevoegen aan lijst
                    </button>
                    {showPlaylistMenu && (
                      <div className="absolute right-0 top-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-xl py-2 min-w-[200px] z-10">
                        {playlists.length === 0 ? (
                          <div className="px-4 py-2 text-gray-500 text-sm">
                            Geen afspeellijsten
                          </div>
                        ) : (
                          playlists.map(playlist => (
                            <button
                              key={playlist.id}
                              onClick={() => handleAddToPlaylist(playlist.id)}
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                            >
                              {playlist.name}
                            </button>
                          ))
                        )}
                        <div className="border-t border-gray-200 mt-2 pt-2">
                          <button
                            onClick={() => {
                              setShowPlaylistMenu(false);
                              onNavigate('playlists');
                            }}
                            className="block w-full text-left px-4 py-2 text-[var(--bright-blue)] hover:bg-gray-100 transition-colors"
                          >
                            Nieuwe lijst maken
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Calendar size={18} />
                    <span className="text-sm">Uitgegeven</span>
                  </div>
                  <div className="text-2xl text-[var(--bright-blue)]">{song.releaseYear}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <TrendingUp size={18} />
                    <span className="text-sm">Noteringen</span>
                  </div>
                  <div className="text-2xl text-[var(--vivid-purple)]">{song.timesInTop2000}x</div>
                </div>
              </div>

              {song.youtubeLink && (
                <a
                  href={song.youtubeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border-2 border-[var(--bright-blue)] text-[var(--bright-blue)] rounded-lg hover:bg-[var(--bright-blue)] hover:text-white transition-colors"
                >
                  <Play size={18} />
                  Beluister op YouTube
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Rankings History */}
        {songRankings.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="mb-6">Noteringen door de jaren</h2>
            
            {/* Chart */}
            <div className="mb-8 overflow-x-auto">
              <div className="min-w-[600px]">
                <svg width="100%" height="300" className="mb-4">
                  {/* Grid lines */}
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
                  
                  {/* Line */}
                  <polyline
                    points={songRankings.map((r, i) => {
                      const x = 60 + (i / (songRankings.length - 1 || 1)) * (chartWidth - 80);
                      const y = 40 + (r.position / maxPosition) * 220;
                      return `${x},${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="3"
                  />
                  
                  {/* Points */}
                  {songRankings.map((r, i) => {
                    const x = 60 + (i / (songRankings.length - 1 || 1)) * (chartWidth - 80);
                    const y = 40 + (r.position / maxPosition) * 220;
                    return (
                      <g key={r.year}>
                        <circle
                          cx={x}
                          cy={y}
                          r="5"
                          fill="#2B6BE4"
                          className="cursor-pointer hover:r-7"
                        />
                        <text
                          x={x}
                          y={280}
                          textAnchor="middle"
                          className="text-xs fill-gray-700"
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
                  {songRankings.map((ranking, index) => {
                    const prevRanking = songRankings[index + 1];
                    const change = prevRanking ? prevRanking.position - ranking.position : null;
                    
                    return (
                      <tr key={ranking.year}>
                        <td className="px-4 py-3">{ranking.year}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center justify-center w-12 h-8 bg-[var(--bright-blue)] text-white rounded">
                            {ranking.position}
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
