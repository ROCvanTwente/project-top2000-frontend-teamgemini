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
    if(searchTerm) {
      filtered = filtered.filter(song =>
        song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.artistName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return [...filtered].sort((a,b) => {
      if(sortBy==='title') return a.title.localeCompare(b.title);
      if(sortBy==='artist') return a.artistName.localeCompare(b.artistName);
      return b.noteringen - a.noteringen;
    });
  }, [songsForUI, searchTerm, sortBy]);

  if(loading) return <div className="text-center py-20">Laden…</div>;
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

        <div className="mb-4 text-gray-600">{filteredAndSortedSongs.length} {filteredAndSortedSongs.length===1?'nummer':'nummers'} gevonden</div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="divide-y divide-gray-100">
            {filteredAndSortedSongs.map(song => (
              <div key={song.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onNavigate('song-detail', { songId: song.id.toString() })}>
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[var(--color-gray-dark)] to-[var(--color-gray-medium)] rounded-lg flex items-center justify-center text-white">
                    <Music2 size={24} />
                  </div>
                  <div className="flex-grow">
                    <h3 className="mb-1 hover:text-[var(--color-gray-medium)]">{song.title}</h3>
                    <p className="text-gray-600 text-sm">{song.artistName} • {song.releaseYear ?? '-'}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm px-3 py-1 bg-[var(--color-gray-dark)] text-white rounded-full">{song.noteringen}x genoteerd</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAndSortedSongs.length===0 && (
            <div className="text-center py-12 text-gray-500">Geen nummers gevonden voor deze zoekopdracht</div>
          )}
        </div>
      </div>
    </div>
  );
}
