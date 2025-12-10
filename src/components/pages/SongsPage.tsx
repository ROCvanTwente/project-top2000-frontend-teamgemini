import { Music2 } from 'lucide-react';

interface SongsPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export function SongsPage({ onNavigate }: SongsPageProps) {
  // All data filtering, searching, and sorting should be done in Razor/backend

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-12 bg-gradient-to-b from-[var(--color-gray-dark)] to-[var(--color-gray-medium)]"></div>
          <h1>Alle Nummers in de TOP 2000</h1>
        </div>

        {/* Songs grid - data should be provided by backend/Razor */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="divide-y divide-gray-100">
            {/* Songs will be rendered by backend/Razor */}
          </div>
        </div>
      </div>
    </div>
  );
}