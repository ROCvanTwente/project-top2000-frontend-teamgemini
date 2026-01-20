import { useState, useEffect, useMemo } from "react";
import { Search, User } from "lucide-react";
// @ts-ignore
import { fetchFromAPI } from "../../api.js";

// ✅ MUI Pagination
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

interface ArtistsPageProps {
  onNavigate?: (page: string, params?: any) => void;
}

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

interface ArtistApi {
  artistId: number;
  name: string;
  biography?: string | null;
  photo?: string | null;
  songs: Song[];
}

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
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "songs">("name");

  // 🔹 Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadArtists = async () => {
      try {
        setLoading(true);
        const data: ArtistApi[] = await fetchFromAPI("artist");
        setArtists(data);
      } catch (err: any) {
        setError(err.message ?? "Fout bij laden");
      } finally {
        setLoading(false);
      }
    };

    loadArtists();
  }, []);

  // reset pagina bij search / sort
  useEffect(() => {
    setPage(1);
  }, [searchTerm, sortBy]);

  const artistsForUI: ArtistUI[] = useMemo(
    () =>
      artists.map((artist) => ({
        id: artist.artistId,
        name: artist.name,
        biography: artist.biography,
        photo: artist.photo,
        songsCount: artist.songs.length,
      })),
    [artists]
  );

  const filteredAndSortedArtists = useMemo(() => {
    let filtered = artistsForUI;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter((artist) =>
        artist.name.toLowerCase().includes(q)
      );
    }

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return b.songsCount - a.songsCount;
    });

    return sorted;
  }, [artistsForUI, searchTerm, sortBy]);

  const totalPages = Math.ceil(
    filteredAndSortedArtists.length / itemsPerPage
  );

  const paginatedArtists = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredAndSortedArtists.slice(start, start + itemsPerPage);
  }, [filteredAndSortedArtists, page]);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
          <div className="text-center">
            <div className="relative mx-auto mb-4 w-16 h-16">
              <div className="absolute inset-0 rounded-full border-4 border-red-500/30"></div>
              <div className="absolute inset-0 rounded-full border-4 border-red-600 border-t-transparent animate-spin"></div>
            </div>
            <h2 className="text-2xl font-black text-white mb-2">
              Laden...
            </h2>
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

      {error && (
        <div className="text-center py-20 text-red-500">{error}</div>
      )}

      {!loading && !error && (
        <>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-12 bg-gradient-to-b from-[var(--color-gray-dark)] to-[var(--color-gray-medium)]"></div>
              <h1>Alle Artiesten in de TOP 2000</h1>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">
                    <Search size={16} className="inline mr-2" />
                    Zoeken op artiestnaam
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Typ om te zoeken..."
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-[var(--color-gray-medium)]"
                  />
                </div>

                <div>
                  <label className="block mb-2">Sorteren op</label>
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(e.target.value as "name" | "songs")
                    }
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-[var(--color-gray-medium)]"
                  >
                    <option value="name">Naam (A-Z)</option>
                    <option value="songs">Aantal nummers</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mb-4 text-gray-600">
              {filteredAndSortedArtists.length}{" "}
              {filteredAndSortedArtists.length === 1 ? "artiest" : "artiesten"}{" "}
              gevonden
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="divide-y divide-gray-100">
                {paginatedArtists.map((artist) => (
                  <div
                    key={artist.id}
                    className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() =>
                      onNavigate?.("artist-detail", {
                        artistId: artist.id.toString(),
                      })
                    }
                  >
                    <div className="flex items-center gap-4">
                      <div className="shrink-0 w-12 h-12 bg-gradient-to-br from-[var(--color-gray-dark)] to-[var(--color-gray-medium)] rounded-lg flex items-center justify-center text-white overflow-hidden">
                        {artist.photo ? (
                          <img
                            src={artist.photo}
                            alt={artist.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User size={24} />
                        )}
                      </div>
                      <div className="grow">
                        <h3>{artist.name}</h3>
                        <p className="text-gray-600 text-sm">
                          {artist.songsCount}{" "}
                          {artist.songsCount === 1 ? "nummer" : "nummers"}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm px-3 py-1 bg-[var(--color-gray-dark)] text-white rounded-full">
                          {artist.songsCount}{" "}
                          {artist.songsCount === 1 ? "nummer" : "nummers"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {paginatedArtists.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  Geen artiesten gevonden voor deze zoekopdracht
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center py-6">
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(_, value: number) => setPage(value)}
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
        </>
      )}
    </div>
  );
}
