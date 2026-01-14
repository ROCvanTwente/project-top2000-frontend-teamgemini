import React, { useState, useEffect, useMemo } from 'react';
import { Search, User, X } from 'lucide-react';
// @ts-ignore
import { fetchFromAPI } from '../../api.js';

interface ArtistsPageProps {
  // No props needed for popup implementation
}

// Song interface for API response
interface Song {
  songId: number;
  artistId: number;
  titel: string;
  releaseYear: number;
  imgUrl?: string | null;
  lyrics?: string | null;
  youtube?: string | null;
  top2000Entries: any[];
}

// API response interface
interface ArtistApi {
  artistId: number;
  name: string;
  biography?: string | null;
  photo?: string | null;
  songs: Song[];
}

// UI interface for artist display
interface ArtistUI {
  id: number;
  name: string;
  biography?: string | null;
  photo?: string | null;
  songsCount: number;
}

// Popup component for artist details
interface ArtistPopupProps {
  artist: ArtistUI;
  onClose: () => void;
}

const ArtistPopup: React.FC<ArtistPopupProps> = ({ artist, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-bold">{artist.name}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>
      <div className="space-y-3">
        {artist.photo && (
          <img 
            src={artist.photo} 
            alt={artist.name}
            className="w-full h-48 object-cover rounded-lg"
          />
        )}
        <p><strong>Naam:</strong> {artist.name}</p>
        <p><strong>Aantal nummers:</strong> {artist.songsCount}</p>
        {artist.biography && (
          <div>
            <strong>Biografie:</strong>
            <p className="mt-1 text-sm text-gray-700">{artist.biography}</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

export function ArtistsPage({}: ArtistsPageProps) {
  const [artists, setArtists] = useState<ArtistApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'songs'>('name');
  const [selectedArtist, setSelectedArtist] = useState<ArtistUI | null>(null);
  const [showAll, setShowAll] = useState(false);
// hier was de oude fetch code voor het ophalen van de songs

  useEffect(() => {
    const loadArtists = async () => {
      try {
        setLoading(true);
        const data: ArtistApi[] = await fetchFromAPI('artist');
        setArtists(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    loadArtists();
  }, []);

  const artistsForUI: ArtistUI[] = useMemo(() => {
    return artists.map(artist => ({
      id: artist.artistId,
      name: artist.name,
      biography: artist.biography,
      photo: artist.photo,
      songsCount: artist.songs.length
    }));
  }, [artists]);

  const filteredAndSortedArtists = useMemo(() => {
    let filtered = artistsForUI;
    if(searchTerm) {
      filtered = filtered.filter(artist =>
        artist.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    const sorted = [...filtered].sort((a,b) => {
      if(sortBy==='name') return a.name.localeCompare(b.name);
      return b.songsCount - a.songsCount;
    });
    
    // Show only 9 artists if not searching and not showing all
    if (!searchTerm && !showAll) {
      return sorted.slice(0, 9);
    }
    return sorted;
  }, [artistsForUI, searchTerm, sortBy, showAll]);

  if(loading) return <div className="text-center py-20">Laden…</div>;
  if(error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">

        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-12 bg-gradient-to-b from-[var(--color-gray-dark)] to-[var(--color-gray-medium)]"></div>
          <h1>Alle Artiesten in de TOP 2000</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2"><Search size={16} className="inline mr-2"/>Zoeken op artiestnaam</label>
              <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                placeholder="Typ om te zoeken..." className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-[var(--color-gray-medium)]" />
            </div>
            <div>
              <label className="block mb-2">Sorteren op</label>
              <select value={sortBy} onChange={e=>setSortBy(e.target.value as any)} className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-[var(--color-gray-medium)]">
                <option value="name">Naam (A-Z)</option>
                <option value="songs">Aantal nummers</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-4 flex justify-between items-center">
          <div className="text-gray-600">
            {searchTerm ? 
              `${filteredAndSortedArtists.length} ${filteredAndSortedArtists.length===1?'artiest':'artiesten'} gevonden` :
              showAll ? 
                `Alle ${artistsForUI.length} artiesten weergegeven` :
                `Eerste 9 van ${artistsForUI.length} artiesten`
            }
          </div>
          {!searchTerm && !showAll && artistsForUI.length > 9 && (
            <button 
              onClick={() => setShowAll(true)}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Toon alle artiesten
            </button>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="divide-y divide-gray-100">
            {filteredAndSortedArtists.map(artist => (
              <div key={artist.id} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => setSelectedArtist(artist)}>
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[var(--color-gray-dark)] to-[var(--color-gray-medium)] rounded-lg flex items-center justify-center text-white">
                    <User size={24} />
                  </div>
                  <div className="flex-grow">
                    <h3 className="mb-1 hover:text-[var(--color-gray-medium)]">{artist.name}</h3>
                    <p className="text-gray-600 text-sm">{artist.songsCount} {artist.songsCount === 1 ? 'nummer' : 'nummers'}</p>
                  </div>
                  {artist.photo && (
                    <div className="flex-shrink-0">
                      <img 
                        src={artist.photo} 
                        alt={artist.name}
                        className="w-12 h-12 object-cover rounded-full"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredAndSortedArtists.length===0 && (
            <div className="text-center py-12 text-gray-500">Geen artiesten gevonden voor deze zoekopdracht</div>
          )}
        </div>
      </div>
      
      {/* Popup for artist details */}
      {selectedArtist && (
        <ArtistPopup 
          artist={selectedArtist} 
          onClose={() => setSelectedArtist(null)} 
        />
      )}
    </div>
  );
}
