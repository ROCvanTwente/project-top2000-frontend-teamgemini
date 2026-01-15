import { useEffect, useState } from 'react';
import { ArrowLeft, User, Music, TrendingUp, Calendar } from 'lucide-react';
// @ts-ignore
import { fetchFromAPI } from '../../api.js';

interface Song {
  songId: number;
  title: string;
  artist: string;
  releaseYear: number | null;
  timesListed: number;
  highestPosition: number | null;
  youtubeLink?: string;
}

interface ArtistStats {
  totalSongs: number;
  bestPosition: number | null;
  totalListings: number;
  activeYears: string;
}

interface ArtistDetailPageProps {
  artistId: string;
  onNavigate: (page: string, params?: any) => void;
}

export function ArtistDetailPage({ artistId, onNavigate }: ArtistDetailPageProps) {
  const [artist, setArtist] = useState<any>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadArtistData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch artist info and songs
        const [artistData, songsData] = await Promise.all([
          fetchFromAPI(`api/artist/${artistId}`),
          fetchFromAPI(`api/artist/${artistId}/songs`)
        ]);
        
        setArtist(artistData);
        setSongs(songsData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadArtistData();
  }, [artistId]);

  if (loading) return <div className="text-center py-20">Laden…</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!artist) return (
    <div className="min-h-screen bg-gray-50 py-12 text-center">
      <h2>Artiest niet gevonden</h2>
      <button onClick={() => onNavigate('artists')} className="mt-4 text-[var(--bright-blue)] hover:underline">
        Terug naar overzicht
      </button>
    </div>
  );

  // Calculate artist statistics
  const stats: ArtistStats = {
    totalSongs: songs.length,
    bestPosition: songs.length > 0 ? Math.min(...songs.map(s => s.highestPosition || 2000)) : null,
    totalListings: songs.reduce((sum, song) => sum + song.timesListed, 0),
    activeYears: songs.length > 0 ? 
      `${Math.min(...songs.filter(s => s.releaseYear).map(s => s.releaseYear!))} - ${Math.max(...songs.filter(s => s.releaseYear).map(s => s.releaseYear!))}` 
      : '-'
  };

  const handleSongClick = (songId: number) => {
    onNavigate('song-detail', { songId: songId.toString() });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        
        <button
          onClick={() => onNavigate('artists')}
          className="flex items-center gap-2 text-[var(--bright-blue)] hover:text-[var(--vivid-purple)] transition-colors mb-8"
        >
          <ArrowLeft size={20} /> Terug naar alle artiesten
        </button>

        {/* Artist Info */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="md:flex">
            {/* Artist Avatar */}
            <div className="md:w-1/3 bg-gradient-to-br from-[var(--bright-blue)] to-[var(--vivid-purple)] aspect-square flex items-center justify-center">
              <div className="text-white text-center p-8">
                <User size={80} className="mx-auto mb-4" />
                <h2 className="text-white mb-2">{artist.name}</h2>
                <p className="text-white/80">{stats.totalSongs} nummer{stats.totalSongs !== 1 ? 's' : ''}</p>
              </div>
            </div>

            {/* Artist Details */}
            <div className="md:w-2/3 p-8">
              <div className="mb-6">
                <h1 className="mb-2">{artist.name}</h1>
                <p className="text-xl text-[var(--bright-blue)]">Top 2000 Artiest</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Music size={18} /> <span className="text-sm">Nummers</span>
                  </div>
                  <div className="text-2xl text-[var(--bright-blue)]">{stats.totalSongs}</div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <TrendingUp size={18} /> <span className="text-sm">Beste positie</span>
                  </div>
                  <div className="text-2xl text-[var(--vivid-purple)]">{stats.bestPosition || '-'}</div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <TrendingUp size={18} /> <span className="text-sm">Totale noteringen</span>
                  </div>
                  <div className="text-2xl text-[var(--bright-blue)]">{stats.totalListings}</div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Calendar size={18} /> <span className="text-sm">Periode</span>
                  </div>
                  <div className="text-sm text-[var(--vivid-purple)]">{stats.activeYears}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Songs List */}
        {/* Top 2000 Songs Section */}
        {songs.filter(song => song.timesListed > 0).length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-[var(--bright-blue)] to-[var(--vivid-purple)]"></div>
              <h2>Top 2000 nummers van {artist.name}</h2>
              <span className="px-3 py-1 bg-[var(--bright-blue)] text-white rounded-full text-sm">
                {songs.filter(song => song.timesListed > 0).length}
              </span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Titel</th>
                    <th className="px-4 py-3 text-left">Jaar</th>
                    <th className="px-4 py-3 text-left">Beste positie</th>
                    <th className="px-4 py-3 text-left">Noteringen</th>
                    <th className="px-4 py-3 text-left">Acties</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {songs
                    .filter(song => song.timesListed > 0)
                    .sort((a, b) => (a.highestPosition || 2000) - (b.highestPosition || 2000))
                    .map((song) => (
                    <tr key={`top2000-${song.songId}`} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium text-gray-900">{song.title}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {song.releaseYear || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center justify-center w-12 h-8 bg-[var(--bright-blue)] text-white rounded">
                          {song.highestPosition}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[var(--vivid-purple)] font-medium">{song.timesListed}x</span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleSongClick(song.songId)}
                          className="text-[var(--bright-blue)] hover:text-[var(--vivid-purple)] transition-colors text-sm font-medium"
                        >
                          Details →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* All Songs List */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-gray-400 to-gray-600"></div>
            <h2>Alle nummers van {artist.name}</h2>
            <span className="px-3 py-1 bg-gray-500 text-white rounded-full text-sm">
              {songs.length}
            </span>
          </div>
          
          {songs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Geen nummers gevonden voor deze artiest.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Titel</th>
                    <th className="px-4 py-3 text-left">Jaar</th>
                    <th className="px-4 py-3 text-left">Beste positie</th>
                    <th className="px-4 py-3 text-left">Noteringen</th>
                    <th className="px-4 py-3 text-left">Acties</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {songs
                    .sort((a, b) => (a.highestPosition || 2000) - (b.highestPosition || 2000))
                    .map((song) => (
                    <tr key={song.songId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium text-gray-900">{song.title}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {song.releaseYear || '-'}
                      </td>
                      <td className="px-4 py-3">
                        {song.highestPosition ? (
                          <span className="inline-flex items-center justify-center w-12 h-8 bg-[var(--bright-blue)] text-white rounded">
                            {song.highestPosition}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">Niet in Top 2000</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {song.timesListed > 0 ? (
                          <span className="text-[var(--vivid-purple)]">{song.timesListed}x</span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleSongClick(song.songId)}
                          className="text-[var(--bright-blue)] hover:text-[var(--vivid-purple)] transition-colors text-sm"
                        >
                          Details →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}