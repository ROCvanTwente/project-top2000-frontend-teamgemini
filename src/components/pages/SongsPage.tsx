import { useState, useEffect, useMemo } from "react";
import { Search, Music2 } from "lucide-react";
// @ts-ignore
import { fetchFromAPI } from "../../api.js";

// ✅ MUI Pagination
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

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

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] =
    useState<"title" | "artist" | "count">("title");

  // 🔹 Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadSongs = async () => {
      try {
        setLoading(true);
        const data: SongApi[] = await fetchFromAPI("songs");
        setSongs(data);
      } catch (err: any) {
        setError(err.message ?? "Fout bij laden");
      } finally {
        setLoading(false);
      }
    };

    loadSongs();
  }, []);

  // reset page bij search / sort
  useEffect(() => {
    setPage(1);
  }, [searchTerm, sortBy]);

  const songsForUI: SongUI[] = useMemo(
    () =>
      songs.map((song) => ({
        id: song.songId,
        title: song.title,
        artistName: song.artist,
        releaseYear: song.releaseYear,
        noteringen: song.timesListed,
        highestPosition: song.highestPosition,
      })),
    [songs]
  );

  const filteredAndSortedSongs = useMemo(() => {
    let filtered = songsForUI;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (song) =>
          song.title.toLowerCase().includes(q) ||
          song.artistName.toLowerCase().includes(q)
      );
    }

    return [...filtered].sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "artist")
        return a.artistName.localeCompare(b.artistName);
      return b.noteringen - a.noteringen;
    });
  }, [songsForUI, searchTerm, sortBy]);

  const totalPages = Math.ceil(
    filteredAndSortedSongs.length / itemsPerPage
  );

  const paginatedSongs = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredAndSortedSongs.slice(
      start,
      start + itemsPerPage
    );
  }, [filteredAndSortedSongs, page]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Loading overlay */}
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
      )}

      {/* Error */}
      {error && <div className="text-center py-20 text-red-500">{error}</div>}

      {/* Main content */}
      {!loading && !error && (
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-12 bg-gradient-to-b from-[var(--color-gray-dark)] to-[var(--color-gray-medium)]" />
            <h1>Alle Nummers in de TOP 2000</h1>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">
                  <Search size={16} className="inline mr-2" />
                  Zoeken
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  placeholder="Typ om te zoeken..."
                  className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-[var(--color-gray-medium)]"
                />
              </div>

              <div>
                <label className="block mb-2">
                  Sorteren op
                </label>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as
                        | "title"
                        | "artist"
                        | "count"
                    )
                  }
                  className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-[var(--color-gray-medium)]"
                >
                  <option value="title">
                    Titel (A-Z)
                  </option>
                  <option value="artist">
                    Artiest (A-Z)
                  </option>
                  <option value="count">
                    Aantal noteringen
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-4 text-gray-600">
            {filteredAndSortedSongs.length} nummers
            gevonden
          </div>

          {/* List */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="divide-y divide-gray-100">
              {paginatedSongs.map((song) => (
                <div
                  key={song.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() =>
                    onNavigate("song-detail", {
                      songId: song.id.toString(),
                    })
                  }
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-gray-dark)] to-[var(--color-gray-medium)] rounded-lg flex items-center justify-center text-white">
                      <Music2 size={24} />
                    </div>
                    <div className="flex-grow">
                      <h3>{song.title}</h3>
                      <p className="text-sm text-gray-600">
                        {song.artistName} •{" "}
                        {song.releaseYear ?? "-"}
                      </p>
                    </div>
                    <div className="text-sm px-3 py-1 bg-[var(--color-gray-dark)] text-white rounded-full">
                      {song.noteringen}x genoteerd
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ✅ Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center py-6">
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value: number) =>
                    setPage(value)
                  }
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

            {paginatedSongs.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                Geen nummers gevonden
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}