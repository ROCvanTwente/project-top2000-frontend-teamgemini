
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Music2, X } from 'lucide-react';
// @ts-ignore
import { fetchFromAPI } from '../../api.js';

interface SongsPageProps {
  // No props needed for popup implementation
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

// Popup component for song details
interface SongPopupProps {
  song: SongUI;
  onClose: () => void;
}

const SongPopup: React.FC<SongPopupProps> = ({ song, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold">{song.title}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>
      <div className="space-y-3">
        <p><strong>Artiest:</strong> {song.artistName}</p>
        <p><strong>Jaar:</strong> {song.releaseYear ?? 'Onbekend'}</p>
        <p><strong>Aantal noteringen:</strong> {song.noteringen}</p>
        <p><strong>Hoogste positie:</strong> {song.highestPosition ? `#${song.highestPosition}` : 'Niet beschikbaar'}</p>
      </div>
    </div>
  </div>
);

export function SongsPage({}: SongsPageProps) {
  const [songs, setSongs] = useState<SongApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'artist' | 'count'>('title');
  const [selectedSong, setSelectedSong] = useState<SongUI | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch('https://localhost:7003/songs')
      .then(res => { if(!res.ok) throw new Error('Kon nummers niet laden'); return res.json(); })
      .then((data: SongApi[]) => { setSongs(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
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
    const sorted = [...filtered].sort((a,b) => {
      if(sortBy==='title') return a.title.localeCompare(b.title);
      if(sortBy==='artist') return a.artistName.localeCompare(b.artistName);
      return b.noteringen - a.noteringen;
    });
    
    // Show only 9 songs if not searching and not showing all
    if (!searchTerm && !showAll) {
      return sorted.slice(0, 9);
    }
    return sorted;
  }, [songsForUI, searchTerm, sortBy, showAll]);

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

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="divide-y divide-gray-100">
            {filteredAndSortedSongs.map(song => (
              <div key={song.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setSelectedSong(song)}>
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
      
      {/* Popup for song details */}
      {selectedSong && (
        <SongPopup 
          song={selectedSong} 
          onClose={() => setSelectedSong(null)} 
        />
      )}
    </div>
  );
}
