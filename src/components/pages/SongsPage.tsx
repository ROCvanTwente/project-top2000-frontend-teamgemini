import { useState, useEffect, useMemo } from 'react';
import { Search, Music2 } from 'lucide-react';
// @ts-ignore
import { fetchFromAPI } from '../../api.js';

interface SongsPageProps {
  onNavigate: (page: string, params?: any) => void;
}

interface SongApi {
  songId: number;
  title: string;
  artist: string;
  releaseYear: number | null;
  timesListed: number;
  highestPosition: number | null;
}

interface SongUI {
  id: number;
  title: string;
  artistName: string;
  releaseYear: number | null;
  noteringen: number;
  highestPosition: number | null;
}

export function SongsPage({ onNavigate }: SongsPageProps) {
  const [songs, setSongs] = useState<SongApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'artist' | 'count'>('title');
  const [showAll, setShowAll] = useState(false);
// hier was de oude fetch code voor het ophalen van de songs
  useEffect(() => {
    const loadSongs = async () => {
      try {
        setLoading(true);
        const data: SongApi[] = await fetchFromAPI('songs');
        setSongs(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadSongs();
  }, []);

  const songsForUI: SongUI[] = useMemo(() => {
    return songs.map(song => ({
      id: song.songId,
      title: song.title,
      artistName: song.artist,
      releaseYear: song.releaseYear,
      noteringen: song.timesListed,
      highestPosition: song.highestPosition
    }));
  }, [songs]);

  const filteredAndSortedSongs = useMemo(() => {
    let filtered = songsForUI;
    
    if (searchTerm) {
      filtered = filtered.filter(song =>
        song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.artistName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Limit to 9 songs if not searching and not showing all
    if (!searchTerm && !showAll) {
      filtered = filtered.slice(0, 9);
    }
    
    return [...filtered].sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'artist') return a.artistName.localeCompare(b.artistName);
      return b.noteringen - a.noteringen;
    });
  }, [songsForUI, searchTerm, sortBy]);

  // Mooie loading overlay toegevoegd (gekopieerd van AdminSongsPage)
  if(loading) {
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

  if(error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">

        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-12 bg-gradient-to-b from-[var(--color-gray-dark)] to-[var(--color-gray-medium)]"></div>
          <h1>Alle Nummers in de TOP 2000</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2"><Search size={16} className="inline mr-2"/>Zoeken op titel of artiest</label>
              <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                placeholder="Typ om te zoeken..." className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-[var(--color-gray-medium)]" />
            </div>
            <div>
              <label className="block mb-2">Sorteren op</label>
              <select value={sortBy} onChange={e=>setSortBy(e.target.value as any)} className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-[var(--color-gray-medium)]">
                <option value="title">Titel (A-Z)</option>
                <option value="artist">Artiest (A-Z)</option>
                <option value="count">Aantal noteringen</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-4 flex justify-between items-center">
          <div className="text-gray-600">
            {searchTerm ? 
              `${filteredAndSortedSongs.length} ${filteredAndSortedSongs.length===1?'nummer':'nummers'} gevonden` :
              showAll ? 
                `Alle ${songsForUI.length} nummers weergegeven` :
                `Eerste 9 van ${songsForUI.length} nummers`
            }
          </div>
          {!searchTerm && !showAll && songsForUI.length > 9 && (
            <button 
              onClick={() => setShowAll(true)}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Toon alle nummers
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedSongs.map(song => (
            <div 
              key={song.id} 
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
              onClick={() => onNavigate('song-detail', { songId: song.id.toString() })}
            >
              {/* Song cover section */}
              <div className="h-48 bg-gradient-to-br from-[var(--bright-blue)] to-[var(--vivid-purple)] flex items-center justify-center relative overflow-hidden">
                <Music2 size={64} className="text-white/60" />
                {/* Times listed badge */}
                <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-sm">
                  {song.noteringen}x genoteerd
                </div>
              </div>
              
              {/* Song info section */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-gray-700 transition-colors">
                  {song.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-2">
                  door {song.artistName}
                </p>
                
                <div className="text-gray-500 text-sm mb-3">
                  {song.releaseYear ? `Uitgebracht in ${song.releaseYear}` : 'Jaar onbekend'}
                  {song.highestPosition && (
                    <span className="ml-2 text-[var(--vivid-purple)] font-medium">
                      • Beste positie: #{song.highestPosition}
                    </span>
                  )}
                </div>
                
                {/* View details button */}
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <div className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Bekijk details →
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredAndSortedSongs.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              Geen nummers gevonden voor deze zoekopdracht
            </div>
          )}
        </div>
      </div>
    </div>
  );
}