import { useEffect, useState, useMemo } from "react";
import type { ChangeEvent } from "react";
import { Search, Filter } from "lucide-react";
// @ts-ignore
import { fetchFromAPI } from "../../api.js";

import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface RankingsPageProps {
  onNavigate: (page: string, params?: any) => void;
}

interface Ranking {
  songId: number;
  position: number;
  title: string;
  artist: string;
  releaseYear: number;
  imgUrl?: string; // <-- hier toegevoegd
}

export function RankingsPage({ onNavigate }: RankingsPageProps) {

  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(50);


  const pageSizeOptions = [50, 100, 200, 500, 1000];

  const availableYears = useMemo(() => {
    const years: number[] = [];
    for (let y = 2024; y >= 1999; y--) years.push(y);
    return years;
  }, []);

  const resetFilters = () => {
    setSelectedYear(2024);
    setSearchTerm("");
    setItemsPerPage(50);
    setPage(1);
  };


  useEffect(() => {
    const loadRankings = async () => {
      try {
        setLoading(true);
        setError(null);
        const data: any = await fetchFromAPI(`top2000/${selectedYear}`);

        const arrayData: Ranking[] = Array.isArray(data)
          ? data
          : data?.$values ?? [];
        setRankings(arrayData);
      } catch (err: any) {
        setError(err.message ?? "Fout bij laden");
        setRankings([]);
      } finally {
        setLoading(false);
      }
    };

    loadRankings();
  }, [selectedYear]);

  useEffect(() => {
    setPage(1);
  }, [selectedYear, searchTerm, itemsPerPage]);

  const filteredRankings = useMemo(() => {
    let data = [...rankings];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      data = data.filter(
        (r) =>
          r.title.toLowerCase().includes(q) 
            );
    }

    return data;
  }, [rankings, searchTerm]);

  const totalPages = Math.ceil(filteredRankings.length / itemsPerPage);

  const paginatedRankings = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredRankings.slice(start, start + itemsPerPage);
  }, [filteredRankings, page, itemsPerPage]);

  if (loading) {
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
            <span
              className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.15s" }}
            ></span>
            <span
              className="w-2 h-2 bg-red-500 rounded-full animate-bounce"
              style={{ animationDelay: "0.3s" }}
            ></span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-12 bg-black" />
          <h1>TOP 2000 Jaaroverzichten</h1>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-end mb-4">
            <button
              onClick={resetFilters}
              className="text-sm px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Filters resetten
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-2">
                <Filter size={16} className="inline mr-2" />
                Jaar
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full border-2 border-gray-200 rounded-lg p-3"
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
                Zoeken
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Zoek op titel"
                className="w-full border-2 border-gray-200 rounded-lg p-3"
              />
            </div>

            <div>
              <label className="block mb-2">Weergavelimiet</label>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="w-full border-2 border-gray-200 rounded-lg p-3"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size} liedjes
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tabel */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
<thead className="bg-black text-white">
  <tr>
    <th className="px-6 py-4 w-24 text-left">#</th>
    <th className="px-6 py-4 text-left">Titel / Album</th>
    <th className="px-6 py-4 text-left">Artiest</th>
    <th className="px-6 py-4 w-32 text-left">Jaar</th>
  </tr>
</thead>
<tbody>
  {paginatedRankings.map((r) => (
    <tr key={r.songId} className="hover:bg-gray-100 transition">
      <td className="px-6 py-4">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-800 font-semibold">
          #{r.position}
        </span>
      </td>

      {/* Titel met albumplaatje */}
      <td
        className="px-6 py-4 font-medium text-black hover:text-red-600 cursor-pointer transition flex items-center gap-3"
        onClick={() => onNavigate("song-detail", { songId: r.songId })}
      >
{r.imgUrl && <img src={r.imgUrl} alt={r.title} className="w-10 h-10 rounded object-cover" />}
        <span>{r.title}</span>
      </td>

      <td className="px-6 py-4 text-gray-700">{r.artist}</td>
      <td className="px-6 py-4 text-gray-600">{r.releaseYear}</td>
    </tr>
  ))}
</tbody>
          </table>
          {totalPages > 1 && (
            <div className="flex justify-center py-6">
              <Pagination
                count={totalPages}
                page={page}
                onChange={(
                  _event: ChangeEvent<unknown>,
                  value: number
                ) => setPage(value)}
                shape="rounded"
                size="large"
                renderItem={(item) => (
                  <PaginationItem
                    slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                    {...item}
                  />
                )}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}