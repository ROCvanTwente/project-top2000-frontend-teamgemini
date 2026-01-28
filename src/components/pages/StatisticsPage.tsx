import { useState } from 'react'; // useEffect is niet meer nodig voor de reset!
import { STATISTIEK_OPTIES } from './StatisticsComponents/StatisticsConfig';
import { StatisticsInfoBlock } from './StatisticsComponents/StatisticsInfoBlock';
import { StatisticsTable } from './StatisticsComponents/StatisticsTable';
import { StatisticsFilter } from './StatisticsComponents/StatisticsFilter';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5237';

interface StatisticsPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export function StatisticsPage({ onNavigate }: StatisticsPageProps) {

  const [selectedStatId, setSelectedStatId] = useState<number>(1);
  const [year, setYear] = useState<number>(2023);

  const [shownStatId, setShownStatId] = useState<number>(1); 

  const [data, setData] = useState<any[]>([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const currentOption = STATISTIEK_OPTIES.find(statistiek => statistiek.id === selectedStatId);

  const handleZoeken = async () => {
    if (!currentOption) return;

    setLoading(true);
    setError(null);

    try {
      // URL bouwen op basis van de HUIDIGE selectie
      let url = `${API_URL}/api/StatistiekenOverzicht/${currentOption.endpoint}`;
      
      if (currentOption.needsYear) {
        url += `/${year}?aantal=2000`; 
      } else {
        url += `?aantal=2000`; 
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 404) throw new Error("Geen resultaten gevonden.");
        throw new Error("Er ging iets mis bij het ophalen van de data.");
      }

      const result = await response.json();
      
      setData(result);
      setShownStatId(selectedStatId);
      setHasSearched(true);

    } catch (err: any) {
      setError(err.message);
      setData([]); 
    } finally {
      setLoading(false);
    }
  };

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

        {/* Info Component (toont info over wat je GESELECTEERD hebt, niet wat je ziet) */}
        <StatisticsInfoBlock option={currentOption} />

        {/* Resultaten Sectie */}
        {hasSearched && (
          <div className="bg-white rounded-lg shadow-md p-6">
            {error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              // BELANGRIJK: We geven hier shownStatId mee, niet selectedStatId!
              <StatisticsTable 
                data={data} 
                selectedStatId={shownStatId}
                onNavigate={onNavigate} 
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}