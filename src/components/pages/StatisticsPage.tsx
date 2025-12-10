interface StatisticsPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export function StatisticsPage({ onNavigate: _onNavigate }: StatisticsPageProps) {
  // All data processing, calculations, and filtering should be done in Razor/backend



  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-12 bg-gradient-to-b from-[var(--color-gray-dark)] to-[var(--color-gray-medium)]"></div>
          <h1>Statistieken TOP 2000</h1>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <p className="text-gray-700 mb-6">
            De statistieken van de TOP 2000 bieden een schat aan informatie voor zowel liefhebbers als onderzoekers van de Nederlandse popmuziekgeschiedenis. Op deze pagina vind je diverse overzichten die inzicht geven in trends en ontwikkelingen binnen de lijst door de jaren heen.
          </p>
          {/* Statistics data and rendering should be provided by backend/Razor */}
        </div>
      </div>
    </div>
  );
}
