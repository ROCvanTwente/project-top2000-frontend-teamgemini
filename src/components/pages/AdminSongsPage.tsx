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
    <div className="admin-container relative">
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

      {message && (
        <div
          className={`notification ${message.type === "error" ? "bg-red-100 border-red-400 text-red-700" : "bg-green-100 border-green-400 text-green-700"} p-3 rounded mb-4`}
        >
          {message.text}
        </div>
      )}

      <h2>Beheer Liedjes via ID of Titel</h2>

      <div className="song-search-input flex gap-2 mb-4">
        <input
          type="number"
          placeholder="ID"
          value={songIdInput}
          onChange={(e) => setSongIdInput(e.target.value)}
          className="border p-2 rounded w-32"
        />
        <input
          type="text"
          placeholder="Titel (optioneel)"
          value={songTitleInput}
          onChange={(e) => setSongTitleInput(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <input type="text" 
          placeholder="Artiest Naam (optioneel)"
          value={songArtistNameInput}
          onChange={(e) => setArtistNameInput(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <button
          onClick={fetchSongs}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Zoek Liedje
        </button>
      </div>

      {songs.length > 1 && !selectedSong && (
        <div className="mb-4">
          <h3>Kies een liedje om te bewerken:</h3>
          <ul className="list-disc pl-6">
            {songs.map((s) => (
              <li key={s.songId} className="cursor-pointer hover:text-red-600" onClick={() => selectSong(s)}>
                {s.songId} - {s.titel} {s.artistName ? `(${s.artistName})` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}

      {}
      {selectedSong ? (
        <div className="edit-panel bg-gray-50 p-6 rounded shadow-md">
          <h3 className="font-semibold mb-4">Liedje Bewerken</h3>
          <table className="w-full mb-4">
            <tbody className="divide-y divide-gray-200">

              <tr>
                <td className="py-2">Titel</td>
                <td>
                  <input
                    value={editData.titel || "Null"}
                    disabled
                    className="border p-2 w-full rounded bg-gray-200 cursor-not-allowed"
                  />
                </td>
              </tr>

              <tr>
                <td className="py-2">Release Jaar</td>
                <td>
                  <input
                    type="number"
                    value={editData.releaseYear ?? "Null"}
                    onChange={(e) =>
                      setEditData({ ...editData, releaseYear: e.target.value ? Number(e.target.value) : undefined })
                    }
                    className="border p-2 w-full rounded"
                  />
                </td>
              </tr>

              <tr>
                <td className="py-2">Artiest ID</td>
                <td>
                  <input
                    type="number"
                    value={editData.artistId ?? "Null"}
                    disabled
                    className="border p-2 w-full rounded bg-gray-200 cursor-not-allowed"
                  />
                </td>
              </tr> 
              <tr>
                <td className="py-2">Artiest Naam</td>
                <td>
                  <input
                    value={editData.artistName ?? "Null"}
                    disabled
                    className="border p-2 w-full rounded bg-gray-200 cursor-not-allowed"
                  />
                </td>
              </tr>
              <tr>
                <td className="py-2">Lyrics</td>
                <td>
                  <textarea
                    value={editData.lyrics || "Null"}
                    onChange={(e) => setEditData({ ...editData, lyrics: e.target.value || undefined })}
                    className="border p-2 w-full rounded"
                  />
                </td>
              </tr>
              <tr>
                <td className="py-2">YouTube URL</td>
                <td>
                  <input
                    value={editData.youtube || "Null"}
                    onChange={(e) => setEditData({ ...editData, youtube: e.target.value || undefined })}
                    className="border p-2 w-full rounded"
                  />
                </td>
              </tr>
              <tr>
                <td className="py-2">Afbeelding URL</td>
                <td>
                  <input
                    value={editData.imgUrl || "Null"}
                    onChange={(e) => setEditData({ ...editData, imgUrl: e.target.value || undefined })}
                    className="border p-2 w-full rounded"
                  />
                </td>
              </tr>
            </tbody>
          </table>

<button
  onClick={saveSong}
  disabled={!hasChanges()}
  className={`px-4 py-2 rounded text-white ${
    hasChanges()
      ? "bg-red-600 hover:bg-red-700"
      : "bg-gray-400 cursor-not-allowed"
  }`}
>
  Opslaan
</button>


        </div>
      ) : songs.length === 0 ? (
        <div>Geen liedje geladen</div>
      ) : null}
    </div>
  );
}