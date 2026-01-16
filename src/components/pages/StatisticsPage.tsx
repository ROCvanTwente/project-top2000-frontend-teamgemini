import { useState } from 'react';

interface StatisticsPageProps {
  onNavigate: (page: string, params?: any) => void;
}

// 1. Configuratie: Welke opties heeft de gebruiker?
// Hier koppelen we de leesbare naam aan de endpoint-naam van je backend.
const STATISTIEK_OPTIES = [
  { id: 1, label: "Grootste Dalers", endpoint: "dalers", needsYear: true },
  { id: 2, label: "Grootste Stijgers", endpoint: "stijgers", needsYear: true },
  { id: 3, label: "Alle Edities (Altijd in de lijst)", endpoint: "alle-edities", needsYear: false },
  { id: 4, label: "Nieuwe Binnenkomers", endpoint: "nieuwe-binnenkomers", needsYear: true },
  { id: 5, label: "Verdwenen uit de lijst", endpoint: "verdwenen", needsYear: true },
  { id: 6, label: "Opnieuw Binnen", endpoint: "opnieuw-binnen", needsYear: true },
  { id: 7, label: "Stabiel (Zelfde positie)", endpoint: "stabiel", needsYear: true },
  { id: 8, label: "Aansluitende Posities", endpoint: "aansluitende-posities", needsYear: true },
  { id: 9, label: "Eenmalige Noteringen", endpoint: "eenmalige-noteringen", needsYear: false },
  { id: 10, label: "Top Artiesten per Jaar", endpoint: "top-artiesten", needsYear: true },
];

export function StatisticsPage({ onNavigate: _onNavigate }: StatisticsPageProps) {
  // 2. State: Hier houden we bij wat de gebruiker doet
  const [selectedStatId, setSelectedStatId] = useState<number>(1);
  const [year, setYear] = useState<number>(2023);
  const [data, setData] = useState<any[]>([]); // De opgehaalde resultaten
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false); // Om te weten of we al een keer gezocht hebben

  // Hulpvariabele om de huidige gekozen optie te vinden
  const currentOption = STATISTIEK_OPTIES.find(o => o.id === selectedStatId);

  // 3. De functie die de data ophaalt
  const handleZoeken = async () => {
    if (!currentOption) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);
    setData([]);

    try {
      // Bouw de URL dynamisch op basis van de keuze
      // Bijv: /api/StatistiekenOverzicht/dalers/2023
      let url = `https://localhost:7003/api/StatistiekenOverzicht/${currentOption.endpoint}`;
      
      // Voeg het jaar toe als deze endpoint dat nodig heeft
      if (currentOption.needsYear) {
        url += `/${year}`;
      }

      // Fetch de data
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header Sectie */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-1 h-12 bg-gradient-to-b from-gray-800 to-gray-500"></div>
          <h1 className="text-3xl font-bold text-gray-800">Statistieken TOP 2000</h1>
        </div>

        {/* --- FILTER BLOCK (Blijft altijd staan) --- */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Filter Opties</h2>
          
          <div className="flex flex-col md:flex-row gap-4 items-end">
            
            {/* 1. Selecteer Statistiek Type */}
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Kies een statistiek</label>
              <select 
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                value={selectedStatId}
                onChange={(e) => setSelectedStatId(Number(e.target.value))}
              >
                {STATISTIEK_OPTIES.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.id}. {opt.label}</option>
                ))}
              </select>
            </div>

            {/* 2. Selecteer Jaar (Alleen tonen/actief maken als het nodig is) */}
            <div className="w-full md:w-1/4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jaar {currentOption?.needsYear ? "(1999 - 2024)" : "(Niet nodig)"}
              </label>
              <input 
                type="number" 
                min="1999" 
                max="2024"
                disabled={!currentOption?.needsYear}
                className={`w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 ${!currentOption?.needsYear ? 'bg-gray-100 text-gray-400' : ''}`}
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              />
            </div>

            {/* 3. Zoek Knop */}
            <div className="w-full md:w-auto">
              <button 
                onClick={handleZoeken}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md transition-colors w-full md:w-auto disabled:bg-blue-300"
              >
                {loading ? "Laden..." : "Toon Statistieken"}
              </button>
            </div>
          </div>
        </div>

        {/* --- RESULTATEN BLOCK (Verschijnt pas na zoeken) --- */}
        {hasSearched && (
          <div className="bg-white rounded-lg shadow-md p-6">
            
            {/* Error Melding */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Tabel met Resultaten */}
            {!error && data.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {/* We maken de headers dynamisch of statisch. Hier een veilige mix */}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titel</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artiest</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jaar</th>
                      {/* Extra kolommen afhankelijk van type statistiek */}
                      {selectedStatId === 1 && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gedaald</th>}
                      {selectedStatId === 2 && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gestegen</th>}
                      {selectedStatId === 10 && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aantal Nummers</th>}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        {/* We gebruiken ?. (optional chaining) omdat DTOs verschillen */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.positie || item.hoogsteNotering || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {item.titel || item.naam || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.artiest || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.uitgiftejaar || "-"}
                        </td>
                        
                        {/* Specifieke data per type */}
                        {selectedStatId === 1 && <td className="px-6 py-4 text-sm text-red-600 font-bold">-{item.plaatsenGedaald}</td>}
                        {selectedStatId === 2 && <td className="px-6 py-4 text-sm text-green-600 font-bold">+{item.plaatsenGestegen}</td>}
                        {selectedStatId === 10 && <td className="px-6 py-4 text-sm text-gray-700">{item.aantalLiedjes}</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Geen resultaten melding (als API wel OK was, maar lege lijst gaf) */}
            {!loading && !error && data.length === 0 && (
               <p className="text-gray-500 text-center italic">Geen resultaten gevonden.</p>
            )}
          </div>
        )}

      </div>
    </div>
  );
}