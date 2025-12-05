import { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { artists } from '../../data/mockData';

interface EditArtistPageProps {
  artistId: string;
  onNavigate: (page: string) => void;
}

export function EditArtistPage({ artistId, onNavigate }: EditArtistPageProps) {
  const artist = artists.find(a => a.id === artistId);
  
  const [formData, setFormData] = useState({
    bio: artist?.bio || '',
    wikipediaLink: artist?.wikipediaLink || '',
    website: artist?.website || '',
    photo: artist?.photo || ''
  });

  if (!artist) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2>Artiest niet gevonden</h2>
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
            <h1 className="mb-2">Artiest Bewerken</h1>
            <div className="flex items-center gap-2 text-gray-600">
              <span className="px-3 py-1 bg-gray-100 rounded">
                {artist.name}
              </span>
              <span className="text-sm">(naam kan niet worden gewijzigd)</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2">
                Biografie
              </label>
              <textarea
                rows={6}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-[var(--bright-blue)] resize-none"
                placeholder="Voeg een biografie toe over de artiest..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Geef een korte beschrijving van de artiest, hun carrière en belangrijke momenten.
              </p>
            </div>

            <div>
              <label className="block mb-2">
                Wikipedia Link
              </label>
              <input
                type="url"
                value={formData.wikipediaLink}
                onChange={(e) => setFormData({ ...formData, wikipediaLink: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-[var(--bright-blue)]"
                placeholder="https://nl.wikipedia.org/wiki/..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Link naar de Wikipedia-pagina van de artiest.
              </p>
            </div>

            <div>
              <label className="block mb-2">
                Officiële Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-[var(--bright-blue)]"
                placeholder="https://www.artistwebsite.com"
              />
              <p className="text-sm text-gray-500 mt-1">
                Link naar de officiële website van de artiest.
              </p>
            </div>

            <div>
              <label className="block mb-2">
                Foto URL
              </label>
              <input
                type="url"
                value={formData.photo}
                onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-lg p-3 focus:outline-none focus:border-[var(--bright-blue)]"
                placeholder="https://example.com/artist-photo.jpg"
              />
              <p className="text-sm text-gray-500 mt-1">
                URL naar een foto van de artiest.
              </p>
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
                opgeslagen in de database. De artiestennaam kan niet worden gewijzigd om de integriteit van 
                de database te waarborgen.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
