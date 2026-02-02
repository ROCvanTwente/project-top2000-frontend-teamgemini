import { useState } from "react";
import axios from "axios";
import "../AdminSongsPage.css";


const API_URL = import.meta.env.VITE_API_URL;

type Song = {
  songId: number;
  titel: string;
  releaseYear?: number;
  artistId?: number;
  artistName?: string;
  imgUrl?: string;
  lyrics?: string;
  youtube?: string;
};

export default function AdminSongsPage() {
  const [loading, setLoading] = useState(false);
  const [songIdInput, setSongIdInput] = useState("");
  const [songTitleInput, setSongTitleInput] = useState("");
  const [songArtistNameInput, setArtistNameInput] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [editData, setEditData] = useState<Partial<Song>>({});
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
const MAX_SONG_ID = 5970;

  const fetchSongs = async () => {
  if (!songIdInput && !songTitleInput && !songArtistNameInput) {
    setMessage({ text: "Vul minimaal één veld in om te zoeken!", type: "error" });
    return;
  }

  if (songIdInput && Number(songIdInput) > MAX_SONG_ID) {
    setMessage({
      text: `Hoogste beschikbare Song ID is ${MAX_SONG_ID}`,
      type: "error",
    });
    return;
  }

  try {
    setLoading(true);

    const params: any = {};
    if (songIdInput) params.id = Number(songIdInput);
    if (songTitleInput) params.titel = songTitleInput;
    if (songArtistNameInput) params.artistName = songArtistNameInput;

    const res = await axios.get(`${API_URL}/admin/songs/search`, { params });
    const data = res.data.$values ?? res.data;

    setSongs(data);

    if (data.length === 1) {
      selectSong(data[0]);
    } else {
      setSelectedSong(null);
      setEditData({});
    }

    setMessage(null);
  } catch (err: any) {
    setMessage({ text: "Liedje is niet gevonden", type: "error" });
    setSongs([]);
    setSelectedSong(null);
    setEditData({});
  } finally {
    setLoading(false);
  }
};


  const selectSong = (song: Song) => {
    setSelectedSong(song);
    setEditData({
      titel: song.titel,
      releaseYear: song.releaseYear,
      artistId: song.artistId,
      artistName: song.artistName,
      imgUrl: song.imgUrl,
      lyrics: song.lyrics,
      youtube: song.youtube,
    });
  };

  const hasChanges = () => {
    if (!selectedSong) return false;

    return (
      (editData.releaseYear ?? null) !== (selectedSong.releaseYear ?? null) ||
      (editData.imgUrl ?? "") !== (selectedSong.imgUrl ?? "") ||
      (editData.lyrics ?? "") !== (selectedSong.lyrics ?? "") ||
      (editData.youtube ?? "") !== (selectedSong.youtube ?? "")
    );
  };

  const saveSong = async () => {
    if (!selectedSong || !hasChanges()) return;

    const dto = {
      releaseYear: editData.releaseYear,
      artistId: editData.artistId,
      imgUrl: editData.imgUrl,
      lyrics: editData.lyrics,
      youtube: editData.youtube,
    };

    try {
      setLoading(true);
      await axios.put(`${API_URL}/admin/songs/${selectedSong.songId}`, dto);

      setSelectedSong({ ...selectedSong, ...editData });
      setMessage({ text: "Liedje succesvol opgeslagen!", type: "success" });
    } catch (err: any) {
      setMessage({ text: "Fout bij opslaan: " + err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="admin-container relative p-4 max-w-xl mx-auto">
  {loading && (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mx-auto mb-4 w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-red-500/30"></div>
          <div className="absolute inset-0 rounded-full border-4 border-red-600 border-t-transparent animate-spin"></div>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-white mb-2">Laden...</h2>
        <p className="text-white/80 text-sm sm:text-base">Even geduld</p>
        <div className="mt-4 flex items-center justify-center gap-1">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></span>
          <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }}></span>
          <span className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></span>
        </div>
      </div>
    </div>
  )}

  {message && (
    <div
      className={`notification ${
        message.type === "error" ? "bg-red-100 border-red-400 text-red-700" : "bg-green-100 border-green-400 text-green-700"
      } p-3 rounded mb-4 text-sm sm:text-base text-center`}
    >
      {message.text}
    </div>
  )}

  <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center">Beheer Liedjes</h2>

  {/* Zoekvelden gecentreerd */}
  <div className="song-search-input flex flex-col sm:flex-row gap-2 mb-6 items-center justify-center">
    <input
      type="text"
      placeholder="Titel (optioneel)"
      value={songTitleInput}
      onChange={(e) => setSongTitleInput(e.target.value)}
      className="border p-2 rounded w-full sm:w-48"
    />
    <input
      type="text"
      placeholder="Artiest Naam (optioneel)"
      value={songArtistNameInput}
      onChange={(e) => setArtistNameInput(e.target.value)}
      className="border p-2 rounded w-full sm:w-48"
    />
    <button
      onClick={fetchSongs}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 w-full sm:w-auto"
    >
      Zoek Liedje
    </button>
  </div>

  {songs.length > 1 && !selectedSong && (
    <div className="mb-4 text-center">
      <h3 className="font-semibold mb-2 text-sm sm:text-base">Kies een liedje om te bewerken:</h3>
      <ul className="list-disc pl-4 sm:pl-6 text-sm sm:text-base inline-block text-left">
        {songs.map((s) => (
          <li
            key={s.songId}
            className="cursor-pointer hover:text-red-600 truncate"
            onClick={() => selectSong(s)}
          >
            {s.songId} - {s.titel} {s.artistName ? `(${s.artistName})` : ""}
          </li>
        ))}
      </ul>
    </div>
  )}

  {selectedSong ? (
    <div className="edit-panel bg-gray-50 p-4 sm:p-6 rounded shadow-md">
      <h3 className="font-semibold mb-4 text-base sm:text-lg">Liedje Bewerken</h3>
      <div className="overflow-x-auto">
        <table className="w-full mb-4 text-sm sm:text-base table-auto">
          <tbody className="divide-y divide-gray-200">
            {[ 
              { label: "Titel", value: editData.titel, disabled: true },
              {
                label: "Release Jaar",
                value: editData.releaseYear ?? "",
                type: "number",
                onChange: (e: any) =>
                  setEditData({ ...editData, releaseYear: e.target.value ? Number(e.target.value) : undefined }),
              },
              { label: "Artiest ID", value: editData.artistId ?? "", disabled: true },
              { label: "Artiest Naam", value: editData.artistName ?? "", disabled: true },
              {
                label: "Lyrics",
                value: editData.lyrics ?? "Null",
                type: "textarea",
                onChange: (e: any) => setEditData({ ...editData, lyrics: e.target.value || undefined }),
                large: true,
              },
              {
                label: "YouTube URL",
                value: editData.youtube ?? "Null",
                onChange: (e: any) => setEditData({ ...editData, youtube: e.target.value || undefined }),
              },
              {
                label: "Afbeelding URL",
                value: editData.imgUrl ?? "Null",
                onChange: (e: any) => setEditData({ ...editData, imgUrl: e.target.value || undefined }),
              },
            ].map((row) => (
              <tr key={row.label}>
                <td className="py-2 pr-4 font-medium whitespace-nowrap align-top">{row.label}</td>
                <td>
                  {row.type === "textarea" ? (
                    <textarea
                      value={row.value || ""}
                      onChange={row.onChange}
                      className="border p-2 w-full rounded h-40 sm:h-60 resize-y"
                    />
                  ) : (
                    <input
                      type={row.type || "text"}
                      value={row.value || ""}
                      disabled={row.disabled}
                      onChange={row.onChange}
                      className={`border p-2 w-full rounded ${row.disabled ? "bg-gray-200 cursor-not-allowed" : ""}`}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={saveSong}
        disabled={!hasChanges()}
        className={`px-4 py-2 rounded text-white w-full sm:w-auto ${
          hasChanges() ? "bg-red-600 hover:bg-red-700" : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Opslaan
      </button>
    </div>
  ) : songs.length === 0 ? (
    <div className="text-center text-sm sm:text-base mt-4">Geen liedje geladen</div>
  ) : null}
</div>
  );
}