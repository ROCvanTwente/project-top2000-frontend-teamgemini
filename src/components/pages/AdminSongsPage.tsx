import { useState } from "react";
import axios from "axios";

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

export default function AdminSongByIdPage() {
  const [songIdInput, setSongIdInput] = useState("");
  const [song, setSong] = useState<Song | null>(null);
  const [editData, setEditData] = useState<Partial<Song>>({});

  // Haal liedje op via ID
  const fetchSong = async () => {
    if (!songIdInput) return alert("Vul een Song ID in");

    try {
      const res = await axios.get(`/admin/songs/${songIdInput}`); // backend GET endpoint nodig
      setSong(res.data);
      setEditData(res.data);
    } catch (err: any) {
      alert("Liedje niet gevonden of fout: " + err.message);
      setSong(null);
    }
  };

  // Opslaan
  const saveSong = async () => {
    if (!song) return;
    try {
      await axios.put(`/admin/songs/${song.songId}`, editData, {
        // headers: { Authorization: `Bearer ${token}` } // later
      });
      alert("Liedje bijgewerkt!");
    } catch (err: any) {
      alert("Fout bij opslaan: " + err.message);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Beheer Liedje via ID</h2>

      <div>
        <input
          type="number"
          placeholder="Voer Song ID in"
          value={songIdInput}
          onChange={(e) => setSongIdInput(e.target.value)}
        />
        <button onClick={fetchSong}>Zoek Liedje</button>
      </div>

      {song && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Liedje Bewerken</h3>
          <table border={1} cellPadding={5}>
            <tbody>
              <tr>
                <td>Titel</td>
                <td>
                  <input
                    value={editData.titel || ""}
                    onChange={(e) => setEditData({ ...editData, titel: e.target.value })}
                  />
                </td>
              </tr>
              <tr>
                <td>Release Jaar</td>
                <td>
                  <input
                    type="number"
                    value={editData.releaseYear || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, releaseYear: Number(e.target.value) })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Artiest ID</td>
                <td>
                  <input
                    type="number"
                    value={editData.artistId || ""}
                    onChange={(e) =>
                      setEditData({ ...editData, artistId: Number(e.target.value) })
                    }
                  />
                </td>
              </tr>
              <tr>
                <td>Lyrics</td>
                <td>
                  <textarea
                    value={editData.lyrics || ""}
                    onChange={(e) => setEditData({ ...editData, lyrics: e.target.value })}
                  />
                </td>
              </tr>
              <tr>
                <td>Youtube</td>
                <td>
                  <input
                    value={editData.youtube || ""}
                    onChange={(e) => setEditData({ ...editData, youtube: e.target.value })}
                  />
                </td>
              </tr>
              <tr>
                <td>Afbeelding URL</td>
                <td>
                  <input
                    value={editData.imgUrl || ""}
                    onChange={(e) => setEditData({ ...editData, imgUrl: e.target.value })}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          <button style={{ marginTop: "1rem" }} onClick={saveSong}>
            Opslaan
          </button>
        </div>
      )}
    </div>
  );
}
