import { useState, useEffect, useMemo } from 'react';
import { Search, User } from 'lucide-react';
// @ts-ignore
import { fetchFromAPI } from '../../api.js';

interface ArtistsPageProps {
  onNavigate?: (page: string, params?: any) => void;
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

export function ArtistsPage({ onNavigate }: ArtistsPageProps) {
  const [artists, setArtists] = useState<ArtistApi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'songs'>('name');
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

  // Verwijder de oude loading check hier, zodat de pagina altijd rendert

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {loading && (
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
      )}

      {error && <div className="text-center py-20 text-red-500">{error}</div>}

      {!loading && !error && (
        <>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-12 bg-linear-to-b from-(--color-gray-dark) to-(--color-gray-medium)"></div>
              <h1>Alle Artiesten in de TOP 2000</h1>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2"><Search size={16} className="inline mr-2"/>Zoeken op artiestnaam</label>
                  <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Typ om te zoeken..." className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-(--color-gray-medium)" />
                </div>
                <div>
                  <label className="block mb-2">Sorteren op</label>
                  <select value={sortBy} onChange={e=>setSortBy(e.target.value as any)} className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-(--color-gray-medium)">
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedArtists.map(artist => (
                <div 
                  key={artist.id} 
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                  onClick={() => onNavigate?.('artist-detail', { artistId: artist.id.toString() })}
                >
                  {/* Artist photo section */}
                  <div className="h-48 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center relative overflow-hidden">
                    {artist.photo ? (
                      <img 
                        src={artist.photo} 
                        alt={artist.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <User size={64} className="text-white/60" />
                    )}
                    {/* Songs count badge */}
                    <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-sm">
                      {artist.songsCount} {artist.songsCount === 1 ? 'nummer' : 'nummers'}
                    </div>
                  </div>
                  
                  {/* Artist info section */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 hover:text-gray-700 transition-colors">
                      {artist.name}
                    </h3>
                    
                    {/* Biography */}
                    <div className="text-gray-600 text-sm leading-relaxed">
                      {artist.biography ? (
                        <p className="line-clamp-4">
                          {artist.biography}
                        </p>
                      ) : (
                        <p className="italic text-gray-400">
                          Geen biografie beschikbaar voor deze artiest.
                        </p>
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

              {filteredAndSortedArtists.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  Geen artiesten gevonden voor deze zoekopdracht
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}