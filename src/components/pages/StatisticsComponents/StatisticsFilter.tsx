// bestandsnaam: src/StatisticsComponents/StatisticsFilter.tsx
import { STATISTIEK_OPTIES } from './StatisticsConfig';

interface Props {
  selectedStatId: number;
  onSelectStatId: (id: number) => void;
  year: number;
  onYearChange: (year: number) => void;
  onSearch: () => void;
  loading: boolean;
}

export function StatisticsFilter({ 
  selectedStatId, 
  onSelectStatId, 
  year, 
  onYearChange, 
  onSearch, 
  loading 
}: Props) {
  
  // We zoeken even de huidige optie op om te weten of we het jaar-veld moeten disablen
  const currentOption = STATISTIEK_OPTIES.find(o => o.id === selectedStatId);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Filter Opties</h2>
      
      <div className="flex flex-col md:flex-row gap-4 items-end">
        
        {/* 1. Selecteer Statistiek Type */}
        <div className="w-full md:w-1/3">
          <label className="block text-sm font-medium text-red-700 mb-1">Kies een statistiek</label>
          <select 
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
            value={selectedStatId}
            onChange={(e) => onSelectStatId(Number(e.target.value))}
          >
            {STATISTIEK_OPTIES.map(opt => (
              <option key={opt.id} value={opt.id}>{opt.id}. {opt.label}</option>
            ))}
          </select>
        </div>

        {/* 2. Selecteer Jaar */}
        <div className="w-full md:w-1/4">
          <label className="block text-sm font-medium text-red-700 mb-1">
            Jaar {currentOption?.needsYear ? "(1999 - 2024)" : "(Niet nodig)"}
          </label>
          <input 
            type="number" 
            min="1999" 
            max="2024"
            disabled={!currentOption?.needsYear}
            className={`w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 ${!currentOption?.needsYear ? 'bg-gray-100 text-gray-400' : ''}`}
            value={year}
            onChange={(e) => onYearChange(Number(e.target.value))}
          />
        </div>

        {/* 3. Zoek Knop */}
        <div className="w-full md:w-auto">
          <button 
            onClick={onSearch}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md transition-colors w-full md:w-auto disabled:bg-blue-300"
          >
            {loading ? "Laden..." : "Toon Statistieken"}
          </button>
        </div>
      </div>
    </div>
  );
}