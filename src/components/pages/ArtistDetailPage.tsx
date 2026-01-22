import { useEffect, useState } from 'react';
 import { ArrowLeft, User, Music, TrendingUp, Calendar, ExternalLink, Globe, Video } from 'lucide-react';
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

  // Generate official website URL (example logic - you can modify this)
  const getOfficialWebsite = (artistName: string) => {
    // Simple example: generate a search URL for the artist
    const searchName = artistName.toLowerCase().replace(/\s+/g, '+');
    return `https://www.google.com/search?q=${searchName}+official+website`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        
        <button
          onClick={() => onNavigate('artists')}
          className="flex items-center gap-2 text-(--bright-blue) hover:text-(--vivid-purple) transition-colors mb-8"
        >
          <ArrowLeft size={20} /> Terug naar alle artiesten
        </button>

        {/* Artist Info */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="md:flex">
            {/* Artist Avatar */}
            <div className="md:w-1/3 bg-gradient-to-br from-[var(--bright-blue)] to-[var(--vivid-purple)] aspect-square flex items-center justify-center overflow-hidden">
              {artist.photo ? (
                <img 
                  src={artist.photo}
                  alt={artist.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-white text-center p-8">
                  <User size={80} className="mx-auto mb-4" />
                  <h2 className="text-white mb-2">{artist.name}</h2>
                  <p className="text-white/80">{stats.totalSongs} nummer{stats.totalSongs !== 1 ? 's' : ''}</p>
                </div>
              )}
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

              {/* Biography Section */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4 text-[var(--bright-blue)]">Biografie</h3>
                <div className="mb-6">
                  <div className="prose prose-lg max-w-none">
                    {artist.biography ? (
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {artist.biography}
                      </p>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-200">
                        <p className="text-gray-500 italic text-center">
                          Er is momenteel geen biografie beschikbaar voor {artist.name}. 
                          <br />
                          Kijk later nog eens terug voor meer informatie over deze artiest.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* External Links */}
              <div className="mt-6">
                <div className="flex flex-wrap gap-3">
                  {artist.wiki && (
                    <a 
                      href={artist.wiki} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-white text-black border-2 border-black rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Globe size={16} />
                      Wikipedia
                      <ExternalLink size={14} />
                    </a>
                  )}
                  
                  <a 
                    href={getOfficialWebsite(artist.name)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-white text-black border-2 border-black rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Globe size={16} />
                    Bezoek Officiële Website
                    <ExternalLink size={14} />
                  </a>

                  {artist.spotifyLink && (
                    <a 
                      href={artist.spotifyLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-[#1DB954] text-white border-2 border-[#1DB954] rounded-lg hover:bg-[#1ed760] transition-colors"
                    >
                      <Music size={16} />
                      Spotify
                      <ExternalLink size={14} />
                    </a>
                  )}

                  {artist.youtubeLink && (
                    <a 
                      href={artist.youtubeLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-[#FF0000] text-white border-2 border-[#FF0000] rounded-lg hover:bg-[#cc0000] transition-colors"
                    >
                      <Video size={16} />
                      YouTube
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top 2000 Songs Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-[var(--bright-blue)] to-[var(--vivid-purple)]"></div>
            <h2>Top 2000 nummers van {artist.name}</h2>
            <span className="px-3 py-1 bg-[var(--bright-blue)] text-white rounded-full text-sm">
              {songs.filter(song => song.timesListed > 0).length}
            </span>
          </div>
          
          {songs.filter(song => song.timesListed > 0).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Deze artiest heeft geen nummers in de Top 2000.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Titel</th>
                    <th className="px-4 py-3 text-left">Jaar</th>
                    <th className="px-4 py-3 text-left">Noteringen</th>
                    <th className="px-4 py-3 text-left">Acties</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {songs
                    .filter(song => song.timesListed > 0)
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
          )}
        </div>
      </div>
    </div>
  );
}