interface RankingsPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export function RankingsPage({ onNavigate: _onNavigate }: RankingsPageProps) {
  // All data filtering, searching, and sorting should be done in Razor/backend

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-12 bg-black"></div>
          <h1>TOP 2000 Jaaroverzichten</h1>
        </div>

        {/* Rankings list - data should be provided by backend/Razor */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black text-white">
                <tr>
                  <th className="px-6 py-4 text-left w-20">Positie</th>
                  <th className="px-6 py-4 text-left">Titel</th>
                  <th className="px-6 py-4 text-left">Artiest</th>
                  <th className="px-6 py-4 text-left w-32">Jaar</th>
                </tr>
              </thead>
              <tbody>
                {/* Rankings will be rendered by backend/Razor */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}