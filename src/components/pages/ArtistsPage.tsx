import { useEffect, useState } from 'react';
// @ts-ignore - api.js is plain JS
import { fetchFromAPI } from '../../api';

interface ArtistsPageProps {
  onNavigate: (page: string, params?: any) => void;
}

type Artist = {
  ArtistId: number;
  Name: string;
  Biography?: string | null;
  Photo?: string | null;
};

export function ArtistsPage({ onNavigate: _onNavigate }: ArtistsPageProps) {
  // Simple frontend that calls the backend artists endpoints
  const [artists, setArtists] = useState<Artist[]>([]);
  const [search, setSearch] = useState<string>('');
  const [minSongs, setMinSongs] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFromAPI('ArtiestenOverzicht')
      .then((data: Artist[]) => setArtists(data))
      .catch((err: any) => setError(err.message));
  }, []);

  const runFilter = async () => {
    setError(null);
    const params = new URLSearchParams();
    if (search) params.set('searchTerm', search);
    if (minSongs !== '') params.set('minSongs', String(minSongs));

    try {
      const data: Artist[] = await fetchFromAPI(`ArtiestenOverzicht/filter?${params.toString()}`);
      setArtists(data);
    } catch (err: any) {
      setError(err.message || String(err));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-12 bg-gradient-to-b from-[var(--color-gray-dark)] to-[var(--color-gray-medium)]"></div>
          <h1>Alle Artiesten in de TOP 2000</h1>
        </div>

        <div className="mb-6 flex gap-3">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Zoek artiest" className="border p-2" />
          <input value={minSongs as any} onChange={e => setMinSongs(e.target.value ? Number(e.target.value) : '')} placeholder="Min songs" type="number" className="border p-2 w-28" />
          <button onClick={runFilter} className="bg-blue-600 text-white px-4 py-2">Filter</button>
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map(a => (
            <div key={a.ArtistId} className="p-4 border rounded">
              <h3 className="font-bold">{a.Name}</h3>
              {a.Photo && <img src={a.Photo} alt={a.Name} className="w-full h-40 object-cover mt-2" />}
              {a.Biography && <p className="text-sm mt-2">{a.Biography.substring(0, 120)}...</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}