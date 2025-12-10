import { ArrowLeft } from 'lucide-react';

interface EditArtistPageProps {
  artistId: string;
  onNavigate: (page: string) => void;
}

export function EditArtistPage({ artistId: _artistId, onNavigate }: EditArtistPageProps) {
  // All edit functionality should be handled by backend/Razor

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

        <div className="bg-white rounded-lg shadow-md p-12 text-center text-gray-500">
          Artiest bewerken wordt afgehandeld door de backend/Razor
        </div>
      </div>
    </div>
  );
}
