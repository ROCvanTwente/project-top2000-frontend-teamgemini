import { List } from 'lucide-react';

interface PlaylistsPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export function PlaylistsPage({ onNavigate }: PlaylistsPageProps) {
  // All playlist creation, deletion, and management logic should be done in Razor/backend

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-12 bg-gradient-to-b from-[var(--bright-blue)] to-[var(--vivid-purple)]"></div>
            <h1>Mijn Afspeellijsten</h1>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <List className="mx-auto mb-4 text-gray-400" size={64} />
          <h2 className="mb-4">Afspeellijsten</h2>
          <p className="text-gray-600 mb-6">
            Afspeellijsten worden beheerd door de backend/Razor
          </p>
        </div>
      </div>
    </div>
  );
}
