import { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import type { Song, Artist } from '../../types';

interface EditSongPageProps {
  songId: string;
  onNavigate: (page: string) => void;
}

export function EditSongPage({ songId, onNavigate }: EditSongPageProps) {
  const [song, _setSong] = useState<Song | null>(null);
  const [artist, _setArtist] = useState<Artist | null>(null);

  useEffect(() => {
    // TODO: Fetch song and artist data from your backend API
    // Example: fetch(`/api/songs/${songId}`), fetch(`/api/artists/${song.artistId}`)
  }, [songId]);
  
  const [formData, setFormData] = useState({
    lyrics: song?.lyrics || '',
    albumCover: song?.albumCover || '',
    youtubeLink: song?.youtubeLink || ''
  });

  if (!song || !artist) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2>Nummer niet gevonden</h2>
          <button
            onClick={() => onNavigate('admin')}
            className="mt-4 text-[var(--bright-blue)] hover:underline"
          >
            Terug naar beheer
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('In deze demo worden de wijzigingen niet opgeslagen. In een echte applicatie zou dit via een database gaan.');
    onNavigate('admin');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => onNavigate('admin')}
          className="flex items-center gap-2 text-[var(--bright-blue)] hover:text-[var(--vivid-purple)] transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Terug naar beheer
        </button>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h1 className="mb-2">Nummer Bewerken</h1>
            <div className="flex flex-wrap items-center gap-2 text-gray-600">
              <span className="px-3 py-1 bg-gray-100 rounded">
                {song.title}
              </span>
              <span className="text-sm">door</span>
              <span className="px-3 py-1 bg-gray-100 rounded">
                {artist.name}
              </span>
              <span className="text-sm">(titel en artiest kunnen niet worden gewijzigd)</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2">
                Songtekst
              </label>
              <textarea
                rows={12}
                value={formData.lyrics}
                onChange={(e) => setFormData({ ...formData, lyrics: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-[var(--bright-blue)] resize-none font-mono text-sm"
                placeholder="Voeg de songtekst toe..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Voeg de volledige songtekst van het nummer toe. Gebruik enters voor nieuwe regels.
              </p>
            </div>

            <div>
              <label className="block mb-2">
                Albumhoes URL
              </label>
              <input
                type="url"
                value={formData.albumCover}
                onChange={(e) => setFormData({ ...formData, albumCover: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-[var(--bright-blue)]"
                placeholder="https://example.com/album-cover.jpg"
              />
              <p className="text-sm text-gray-500 mt-1">
                URL naar de albumhoes afbeelding.
              </p>
            </div>

            <div>
              <label className="block mb-2">
                YouTube Link
              </label>
              <input
                type="url"
                value={formData.youtubeLink}
                onChange={(e) => setFormData({ ...formData, youtubeLink: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-[var(--bright-blue)]"
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Link naar de officiële YouTube video of audio van het nummer.
              </p>
              {formData.youtubeLink && (
                <div className="mt-2">
                  <a
                    href={formData.youtubeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--bright-blue)] hover:underline text-sm"
                  >
                    Preview link →
                  </a>
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-6 border-t border-gray-200">
              <button
                type="submit"
                className="flex items-center gap-2 bg-[var(--bright-blue)] hover:bg-[var(--vivid-purple)] text-white px-6 py-3 rounded-lg transition-colors"
              >
                <Save size={20} />
                Wijzigingen opslaan
              </button>
              <button
                type="button"
                onClick={() => onNavigate('admin')}
                className="border-2 border-gray-300 hover:border-gray-400 px-6 py-3 rounded-lg transition-colors"
              >
                Annuleren
              </button>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mt-6">
              <p className="text-sm text-yellow-800">
                <strong>Let op:</strong> Dit is een demo-versie. In de echte applicatie worden wijzigingen 
                opgeslagen in de database. De titel en artiest van het nummer kunnen niet worden gewijzigd 
                om de integriteit van de database te waarborgen.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
