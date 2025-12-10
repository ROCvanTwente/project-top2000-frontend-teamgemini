interface ArtistsPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export function ArtistsPage({ onNavigate }: ArtistsPageProps) {
  // All data filtering, searching, sorting, and counting should be done in Razor/backend

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-12 bg-gradient-to-b from-[var(--color-gray-dark)] to-[var(--color-gray-medium)]"></div>
          <h1>Alle Artiesten in de TOP 2000</h1>
        </div>

        {/* Artists grid - data should be provided by backend/Razor */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Artists will be rendered by backend/Razor */}
        </div>
      </div>
    </div>
  );
}