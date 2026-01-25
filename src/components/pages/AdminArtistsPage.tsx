import { useState } from "react";
import axios from "axios";
import "../AdminSongsPage.css"; // je kan dezelfde CSS gebruiken

const API_URL = import.meta.env.VITE_API_URL;

type Artist = {
  artistId: number;
  name: string;
  wiki?: string;
  biography?: string;
  photo?: string;
};

export default function AdminArtistsPage() {
  const [loading, setLoading] = useState(false);
  const [artistIdInput, setArtistIdInput] = useState("");
  const [artistNameInput, setArtistNameInput] = useState("");
  const [artists, setArtists] = useState<Artist[]>([]);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [editData, setEditData] = useState<Partial<Artist>>({});
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const fetchArtists = async () => {
    if (!artistIdInput && !artistNameInput) {
      setMessage({ text: "Vul minimaal één veld in om te zoeken!", type: "error" });
      return;
    }

    try {
      setLoading(true);

      const params: any = {};
      if (artistIdInput) params.id = Number(artistIdInput);
      if (artistNameInput) params.name = artistNameInput;

      const res = await axios.get(`${API_URL}/admin/artists/search`, { params });
      const data = res.data.$values ?? res.data;

      setArtists(data);

      if (data.length === 1) {
        selectArtist(data[0]);
      } else {
        setSelectedArtist(null);
        setEditData({});
      }

      setMessage(null);
    } catch (err: any) {
      setMessage({ text: "Artiest niet gevonden", type: "error" });
      setArtists([]);
      setSelectedArtist(null);
      setEditData({});
    } finally {
      setLoading(false);
    }
  };

  const selectArtist = (artist: Artist) => {
    setSelectedArtist(artist);
    setEditData({
      artistId: artist.artistId,
      name: artist.name,
      wiki: artist.wiki,
      biography: artist.biography,
      photo: artist.photo,
    });
  };

  const hasChanges = () => {
    if (!selectedArtist) return false;

    return (
      (editData.wiki ?? "") !== (selectedArtist.wiki ?? "") ||
      (editData.biography ?? "") !== (selectedArtist.biography ?? "") ||
      (editData.photo ?? "") !== (selectedArtist.photo ?? "")
    );
  };

  const saveArtist = async () => {
    if (!selectedArtist || !hasChanges()) return;

    const dto = {
      wiki: editData.wiki,
      biography: editData.biography,
      photo: editData.photo,
    };

    try {
      setLoading(true);
      await axios.put(`${API_URL}/admin/artists/${selectedArtist.artistId}`, dto);

      setSelectedArtist({ ...selectedArtist, ...editData });
      setMessage({ text: "Artiest succesvol opgeslagen!", type: "success" });
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
          </div>
        </div>
      )}

      {message && (
        <div
          className={`notification ${
            message.type === "error"
              ? "bg-red-100 border-red-400 text-red-700"
              : "bg-green-100 border-green-400 text-green-700"
          } p-3 rounded mb-4`}
        >
          {message.text}
        </div>
      )}

      <h2>Beheer Artiesten</h2>

      <div className="song-search-input flex gap-2 mb-4">
        <input
          type="number"
          placeholder="ID"
          value={artistIdInput}
          onChange={(e) => setArtistIdInput(e.target.value)}
          className="border p-2 rounded w-32"
        />
        <input
          type="text"
          placeholder="Naam (optioneel)"
          value={artistNameInput}
          onChange={(e) => setArtistNameInput(e.target.value)}
          className="border p-2 rounded w-64"
        />
        <button
          onClick={fetchArtists}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Zoek Artiest
        </button>
      </div>

      {artists.length > 1 && !selectedArtist && (
        <div className="mb-4">
          <h3>Kies een artiest om te bewerken:</h3>
          <ul className="list-disc pl-6">
            {artists.map((a) => (
              <li
                key={a.artistId}
                className="cursor-pointer hover:text-red-600"
                onClick={() => selectArtist(a)}
              >
                {a.artistId} - {a.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedArtist ? (
        <div className="edit-panel bg-gray-50 p-6 rounded shadow-md">
          <h3 className="font-semibold mb-4">Artiest Bewerken</h3>
          <table className="w-full mb-4">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-2">Naam</td>
                <td>
                  <input
                    value={editData.name ?? ""}
                    disabled
                    className="border p-2 w-full rounded bg-gray-200 cursor-not-allowed"
                  />
                </td>
              </tr>
              <tr>
                <td className="py-2">Wiki</td>
                <td>
                  <input
                    value={editData.wiki ?? ""}
                    onChange={(e) => setEditData({ ...editData, wiki: e.target.value })}
                    className="border p-2 w-full rounded"
                  />
                </td>
              </tr>
              <tr>
                <td className="py-2">Biografie</td>
                <td>
                  <textarea
                    value={editData.biography ?? ""}
                    onChange={(e) => setEditData({ ...editData, biography: e.target.value })}
                    className="border p-2 w-full rounded"
                  />
                </td>
              </tr>
              <tr>
                <td className="py-2">Foto URL</td>
                <td>
                  <input
                    value={editData.photo ?? "Null"}
                    onChange={(e) => setEditData({ ...editData, photo: e.target.value })}
                    className="border p-2 w-full rounded"
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <button
            onClick={saveArtist}
            disabled={!hasChanges()}
            className={`px-4 py-2 rounded text-white ${
              hasChanges() ? "bg-red-600 hover:bg-red-700" : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Opslaan
          </button>
        </div>
      ) : artists.length === 0 ? (
        <div>Geen artiest geladen</div>
      ) : null}
    </div>
  );
}
