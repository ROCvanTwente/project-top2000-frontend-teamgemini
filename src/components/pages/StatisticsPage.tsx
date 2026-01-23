import { useState } from 'react';
import { STATISTIEK_OPTIES } from './StatisticsComponents/StatisticsConfig';
import { StatisticsInfoBlock } from './StatisticsComponents/StatisticsInfoBlock';
import { StatisticsTable } from './StatisticsComponents/StatisticsTable';
import { StatisticsFilter } from './StatisticsComponents/StatisticsFilter';

const API_URL = import.meta.env.VITE_API_URL;


interface StatisticsPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export function StatisticsPage({ onNavigate: _onNavigate }: StatisticsPageProps) {

  const [selectedStatId, setSelectedStatId] = useState<number>(1);
  const [year, setYear] = useState<number>(2023);
  const [data, setData] = useState<any[]>([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const currentOption = STATISTIEK_OPTIES.find(statistiek => statistiek.id === selectedStatId);

  // data ophalen
  const handleZoeken = async () => {
    if (!currentOption) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);
    setData([]);

    try {
      // URL bouwen
let url = `${API_URL}/api/StatistiekenOverzicht/${currentOption.endpoint}`;
      
      if (currentOption.needsYear) {
        url += `/${year}`;
      }

      // Fetch uitvoeren
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 404) throw new Error("Geen gegevens gevonden voor deze selectie.");
        if (response.status === 400) throw new Error("Ongeldige invoer (check het jaartal).");
        throw new Error("Er ging iets mis bij het ophalen van de data.");
      }

      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. componenten weergeven
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-12 bg-gradient-to-b from-gray-800 to-gray-500"></div>
          <h1 className="text-3xl font-bold text-gray-800">Statistieken TOP 2000</h1>
        </div>

        {/* Filter Component */}
        <StatisticsFilter 
          selectedStatId={selectedStatId}
          onSelectStatId={setSelectedStatId}
          year={year}
          onYearChange={setYear}
          onSearch={handleZoeken}
          loading={loading}
        />

        {/* Info Component */}
        <StatisticsInfoBlock option={currentOption} />

        {/* Resultaten Sectie */}
        {hasSearched && (
          <div className="bg-white rounded-lg shadow-md p-6">
            {error ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700">
                {error}
              </div>
            ) : (
              /* Tabel Component */
              <StatisticsTable data={data} selectedStatId={selectedStatId} />
            )}
          </div>
        )}

      </div>
    </div>
  );
}