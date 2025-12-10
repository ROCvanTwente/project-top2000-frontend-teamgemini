import { ArrowLeft } from 'lucide-react';

interface ArtistDetailPageProps {
  artistId: string;
  onNavigate: (page: string, params?: any) => void;
}

export function ArtistDetailPage({ artistId: _artistId, onNavigate }: ArtistDetailPageProps) {
  // All data fetching and filtering should be done in Razor/backend

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <button
          onClick={() => onNavigate('artists')}
          className="flex items-center gap-2 text-[var(--bright-blue)] hover:text-[var(--vivid-purple)] transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          Terug naar alle artiesten
        </button>

        {/* Artist detail content should be provided by backend/Razor */}
        <div className="bg-white rounded-lg shadow-md p-12 text-center text-gray-500">
          Artist details worden getoond door de backend/Razor
        </div>
      </div>
    </div>
  );
}
