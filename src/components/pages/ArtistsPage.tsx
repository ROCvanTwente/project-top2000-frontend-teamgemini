import { useEffect, useState } from 'react';

interface ArtistsPageProps {
  onNavigate: (page: string, params?: any) => void;
}

// TypeScript interface gebaseerd op je API-response
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

interface Artist {
  artistId: number;
  name: string;
  biography?: string | null;
  photo?: string | null;
  songs: Song[];
}

export function ArtistsPage({ onNavigate: _onNavigate }: ArtistsPageProps) {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [minSongs, setMinSongs] = useState<number | ''>('');

  // Fetch alle artiesten bij load
  useEffect(() => {
    setLoading(true);
    fetch('https://teamgeminitestapi.runasp.net/artist')
      .then((res) => {
        console.log(res)
        if (!res.ok) throw new Error('Fout bij ophalen data');
        return res.json();
      })
      .then((data: Artist[]) => {
        setArtists(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Filter functie
  const runFilter = async () => {
    setError(null);
    setLoading(true);

    const params = new URLSearchParams();
    if (search) params.set('searchTerm', search);
    if (minSongs !== '') params.set('minSongs', String(minSongs));

    try {
      const res = await fetch(`https://teamgeminitestapi.runasp.net/artist/filter?${params.toString()}`);
      if (!res.ok) throw new Error('Fout bij ophalen filtered data');
      const data: Artist[] = await res.json();
      setArtists(data);
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-12 bg-gradient-to-b from-gray-700 to-gray-400"></div>
          <h1>Alle Artiesten in de TOP 2000</h1>
        </div>

        <div className="mb-6 flex gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Zoek artiest"
            className="border p-2"
          />
          <input
            value={minSongs as any}
            onChange={(e) => setMinSongs(e.target.value ? Number(e.target.value) : '')}
            placeholder="Min songs"
            type="number"
            className="border p-2 w-28"
          />
          <button
            onClick={runFilter}
            className="bg-blue-600 text-white px-4 py-2"
          >
            Filter
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map((a) => (
            <div key={a.artistId} className="p-4 border rounded">
              <h3 className="font-bold">{a.name}</h3>
              {a.photo && (
                <img
                  src={a.photo}
                  alt={a.name}
                  className="w-full h-40 object-cover mt-2"
                />
              )}
              {a.biography && (
                <p className="text-sm mt-2">{a.biography.substring(0, 120)}...</p>
              )}
              <p className="text-xs mt-2 text-gray-500">
                Aantal nummers: {a.songs.length}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
