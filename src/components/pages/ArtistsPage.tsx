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
  songCount?: number;
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

  // Pagination
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Load artists
useEffect(() => {
  const loadArtists = async () => {
    try {
      setLoading(true);
      const data: any = await fetchFromAPI("artist");

      // Zet altijd een echte array
      const arrayData: ArtistApi[] = Array.isArray(data)
        ? data
        : data?.$values ?? [];

      setArtists(arrayData);
    } catch (err: any) {
      setError(err.message ?? "Fout bij laden");
      setArtists([]);
    } finally {
      setLoading(false);
    }
  };
  loadArtists();
}, []);

  // Reset page bij search
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const [sortBy, setSortBy] = useState<"name" | "songsCount">("name");

  const artistsForUI: ArtistUI[] = useMemo(
    () => {
      // Deduplicate by artist name (case-insensitive)
      const seen = new Set<string>();
      let arr = artists
        .map((artist) => {
          const artistAny = artist as any;
          const rawSongs = artistAny.songs ?? artistAny.Songs ?? artistAny.$values ?? [];
          const resolveValues = (v: any) => {
            if (Array.isArray(v)) return v;
            if (v && Array.isArray(v.$values)) return v.$values;
            return [] as any[];
          };
          const songsArray = resolveValues(rawSongs);
          const count = typeof artistAny.songCount === 'number'
            ? artistAny.songCount
            : songsArray.length;
          return {
            id: artist.artistId,
            name: artist.name,
            biography: artist.biography,
            photo: artist.photo,
            songsCount: count,
          };
        })
        .filter((artist) => {
          const nameKey = artist.name.trim().toLowerCase();
          if (seen.has(nameKey)) return false;
          seen.add(nameKey);
          return true;
        });
      // Sort based on dropdown
      if (sortBy === "name") {
        arr = arr.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortBy === "songsCount") {
        arr = arr.sort((a, b) => b.songsCount - a.songsCount);
      }
      return arr;
    },
    [artists, sortBy]
  );

  const filteredArtists = useMemo(() => {
    let filtered = artistsForUI;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter((artist) =>
        artist.name.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [artistsForUI, searchTerm]);

  const totalPages = Math.ceil(
    filteredArtists.length / itemsPerPage
  );

  const paginatedArtists = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredArtists.slice(start, start + itemsPerPage);
  }, [filteredArtists, page]);

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
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-12 bg-gradient-to-b from-gray-800 to-gray-400"></div>
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
                  className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-gray-400"
                />
              </div>
              <div>
                <label className="block mb-2">Sorteren op</label>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as "name" | "songsCount")}
                  className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-gray-400"
                >
                  <option value="name">Naam (A-Z)</option>
                  <option value="songsCount">Aantal nummers (hoog-laag)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Result count */}
          <div className="mb-4 text-gray-600">
            {filteredArtists.length}{" "}
            {filteredArtists.length === 1 ? "artiest" : "artiesten"}{" "}
            gevonden
          </div>

          {/* Artist grid */}
          {paginatedArtists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedArtists.map((artist) => (
                <div
                  key={artist.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                  onClick={() =>
                    onNavigate?.("artist-detail", { artistId: artist.id.toString() })
                  }
                >
                  {/* Photo */}
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

                    <div className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-sm">
                      {artist.songsCount}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 hover:text-gray-700 transition-colors">
                      {artist.name}
                    </h3>
                    <div className="text-gray-600 text-sm leading-relaxed">
                      {artist.biography ? (
                        <p className="line-clamp-4">{artist.biography}</p>
                      ) : (
                        <p className="italic text-gray-400">Geen biografie beschikbaar voor deze artiest.</p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <div className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Bekijk details →
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Geen artiesten gevonden voor deze zoekopdracht
            </div>
          )}

          {/* Pagination */}
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
                    slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                    {...item}
                  />
                )}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
