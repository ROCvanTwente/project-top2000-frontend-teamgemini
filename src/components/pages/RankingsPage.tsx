import { useEffect, useState, useMemo } from "react";
import { Search, Filter } from "lucide-react";

interface RankingsPageProps {
  onNavigate: (page: string, params?: any) => void;
}

interface Ranking {
  songId: number;
  position: number;
  title: string;
  artist: string;
  releaseYear: number;
}

export function RankingsPage({ onNavigate }: RankingsPageProps) {
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"position" | "artist" | "title">("position");

  // Vast bereik van jaren: 1999 t/m 2024
  const availableYears = useMemo(() => {
    const start = 1999;
    const end = 2024;
    const years = [];
    for (let y = end; y >= start; y--) years.push(y);
    return years;
  }, []);

  // Fetch data op basis van geselecteerd jaar
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`https://localhost:7003/top2000/${selectedYear}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Geen data gevonden voor jaar ${selectedYear}`);
        return res.json();
      })
      .then((data: Ranking[]) => {
        setRankings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setRankings([]);
        setLoading(false);
      });
  }, [selectedYear]);

  const filteredRankings = useMemo(() => {
    let data = [...rankings];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      data = data.filter(
        (r) =>
          r.title.toLowerCase().includes(lowerSearch) ||
          r.artist.toLowerCase().includes(lowerSearch)
      );
    }

    return data.sort((a, b) => {
      if (sortBy === "position") return a.position - b.position;
      if (sortBy === "artist") return a.artist.localeCompare(b.artist);
      return a.title.localeCompare(b.title);
    });
  }, [rankings, searchTerm, sortBy]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-12 bg-black"></div>
          <h1>TOP 2000 Jaaroverzichten</h1>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-2">
                <Filter size={16} className="inline mr-2" />
                Jaar
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-black"
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2">
                <Search size={16} className="inline mr-2" />
                Zoeken op artiest of titel
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Typ om te zoeken..."
                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block mb-2">Sorteren op</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-black"
              >
                <option value="position">Positie</option>
                <option value="artist">Artiest</option>
                <option value="title">Titel</option>
              </select>
            </div>
          </div>
        </div>

        {/* Resultaten */}
        <div className="mb-4 text-gray-600">
          {filteredRankings.length} {filteredRankings.length === 1 ? "nummer" : "nummers"} gevonden
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black text-white">
                <tr>
                  <th className="px-6 py-4 text-left w-20">Positie</th>
                  <th className="px-6 py-4 text-left">Titel</th>
                  <th className="px-6 py-4 text-left">Artiest</th>
                  <th className="px-6 py-4 text-left w-32">Jaar</th>
                </tr>
              </thead>
              <tbody>
                {filteredRankings.map((r) => (
                  <tr
                    key={r.songId}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">{r.position}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => onNavigate("song-detail", { songId: r.songId })}
                        className="text-left hover:underline text-blue-600"
                      >
                        {r.title}
                      </button>
                    </td>
                    <td className="px-6 py-4">{r.artist}</td>
                    <td className="px-6 py-4">{r.releaseYear}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredRankings.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                Geen resultaten gevonden voor deze zoekopdracht
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
