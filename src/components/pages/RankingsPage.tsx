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
}

export function RankingsPage({ onNavigate }: RankingsPageProps) {
  const [rankings, setRankings] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] =
    useState<"position" | "artist" | "title">("position");

  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 25;

  const availableYears = useMemo(() => {
    const years: number[] = [];
    for (let y = 2024; y >= 1999; y--) years.push(y);
    return years;
  }, []);

  useEffect(() => {
    const loadRankings = async () => {
      try {
        setLoading(true);
        setError(null);
        const data: Ranking[] = await fetchFromAPI(
          `top2000/${selectedYear}`
        );
        setRankings(data);
      } catch (err: any) {
        console.error(err);
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
  }, [selectedYear, searchTerm, sortBy]);

  const filteredRankings = useMemo(() => {
    let data = [...rankings];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      data = data.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.artist.toLowerCase().includes(q)
      );
    }

    return data.sort((a, b) => {
      if (sortBy === "position") return a.position - b.position;
      if (sortBy === "artist") return a.artist.localeCompare(b.artist);
      return a.title.localeCompare(b.title);
    });
  }, [rankings, searchTerm, sortBy]);

  const totalPages = Math.ceil(filteredRankings.length / itemsPerPage);

  const paginatedRankings = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredRankings.slice(start, start + itemsPerPage);
  }, [filteredRankings, page]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          Laden...
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

   
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-2">
                <Filter size={16} className="inline mr-2" />
                Jaar
              </label>
              <select
                value={selectedYear}
                onChange={(e) =>
                  setSelectedYear(Number(e.target.value))
                }
                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-black"
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
                placeholder="Zoek op titel of artiest"
                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-black"
              />
            </div>

            <div>
              <label className="block mb-2">Sorteren op</label>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "position" | "artist" | "title")
                }
                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-black"
              >
                <option value="position">Positie</option>
                <option value="artist">Artiest</option>
                <option value="title">Titel</option>
              </select>
            </div>
          </div>
        </div>


        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black text-white">
                <tr>
                  <th className="px-6 py-4 w-20 text-left">#</th>
                  <th className="px-6 py-4 text-left">Titel</th>
                  <th className="px-6 py-4 text-left">Artiest</th>
                  <th className="px-6 py-4 w-32 text-left">Jaar</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRankings.map((r) => (
                  <tr
                    key={r.songId}
                    onClick={() =>
                      onNavigate("song-detail", {
                        songId: r.songId,
                      })
                    }
                    className="border-b hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4">{r.position}</td>
                    <td className="px-6 py-4 text-blue-600 hover:underline">
                      {r.title}
                    </td>
                    <td className="px-6 py-4">{r.artist}</td>
                    <td className="px-6 py-4">{r.releaseYear}</td>
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
                      slots={{
                        previous: ArrowBackIcon,
                        next: ArrowForwardIcon,
                      }}
                      {...item}
                    />
                  )}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
