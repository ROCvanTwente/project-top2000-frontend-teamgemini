import { useState } from "react";
import axios from "axios";
import "../AdminSongsPage.css";

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
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [editData, setEditData] = useState<Partial<Song>>({});
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchSongs = async () => {
    if (!songIdInput && !songTitleInput) {
      setMessage({ text: "Vul minimaal één veld in om te zoeken!", type: "error" });
      return;
    }

    try {
      setLoading(true);
      const params: any = {};
      if (songIdInput) params.id = Number(songIdInput);
      if (songTitleInput) params.titel = songTitleInput;

      const res = await axios.get(`https://demotop2000.runasp.net/admin/songs/search`, { params });
      const data: Song[] = res.data;

      setSongs(data);

      if (data.length === 1) {
        selectSong(data[0]);
      } else {
        setSelectedSong(null);
        setEditData({});
      }

      setLoading(false);
      setMessage(null);
    } catch (err: any) {
      setLoading(false);
      setMessage({ text: "Liedje(s) niet gevonden of fout: " + err.message, type: "error" });
      setSongs([]);
      setSelectedSong(null);
      setEditData({});
    }
  };

  const selectSong = (song: Song) => {
    setSelectedSong(song);
    setEditData({
      titel: song.titel || undefined,
      releaseYear: song.releaseYear ?? undefined,
      artistId: song.artistId ?? undefined,
      artistName: song.artistName || undefined,
      imgUrl: song.imgUrl || undefined,
      lyrics: song.lyrics || undefined,
      youtube: song.youtube || undefined,
    });
  };
const hasChanges = () => {
  if (!selectedSong) return false;

  return (
    (editData.titel ?? "") !== (selectedSong.titel ?? "") ||
    (editData.releaseYear ?? null) !== (selectedSong.releaseYear ?? null) ||
    (editData.imgUrl ?? "") !== (selectedSong.imgUrl ?? "") ||
    (editData.lyrics ?? "") !== (selectedSong.lyrics ?? "") ||
    (editData.youtube ?? "") !== (selectedSong.youtube ?? "")
  );
};


const saveSong = async () => {
  if (!selectedSong) return;

  if (!hasChanges()) {
    alert("Je hebt niks aangepast. Verander eerst iets voordat je opslaat.");
    return;
  }

  const dto = {
    titel: editData.titel,
    releaseYear: editData.releaseYear,
    artistId: editData.artistId,
    imgUrl: editData.imgUrl,
    lyrics: editData.lyrics,
    youtube: editData.youtube,
  };

  try {
    setLoading(true);
    await axios.put(`https://demotop2000.runasp.net/admin/songs/${selectedSong.songId}`, dto);

    setTimeout(() => {
      window.location.href = "/?success=true";
    }, 1500);
  } catch (err: any) {
    setLoading(false);
    setMessage({ text: "Fout bij opslaan: " + err.message, type: "error" });
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
        <button
          onClick={fetchSongs}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Zoek Liedje(s)
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
                    onChange={(e) => setEditData({ ...editData, titel: e.target.value || undefined })}
                    className="border p-2 w-full rounded"
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
                    readOnly
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
