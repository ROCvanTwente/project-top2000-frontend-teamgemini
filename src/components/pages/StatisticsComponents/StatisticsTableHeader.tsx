interface Props {
  selectedStatId: number;
}

export function StatisticsTableHeader({ selectedStatId }: Props) {
  const isArtistMode = selectedStatId === 10;
  const positionLabel = selectedStatId === 5 ? "Pos. Vorig Jaar" : "Positie";

  return (
    <thead className="bg-gray-50">
      <tr>
        {/* Kolom voor de ranglijst-nummering (1, 2, 3...) - Die laten we staan */}
        <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider w-12">
          Nr.
        </th>

        {/* Top 2000 Positie Kolom - VERBERGEN BIJ EVERGREENS (ID 3) */}
        {selectedStatId !== 3 && (
          <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
            {positionLabel}
          </th>
        )}
        
        {isArtistMode ? (
          <>
            <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">Artiest Naam</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">Aantal Nummers</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">Gem. Positie</th>
          </>
        ) : (
          <>
            <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">Titel</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">Artiest</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">Jaar</th>
            
            {selectedStatId === 9 && (
               <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">In Top 2000</th>
            )}
          </>
        )}

        {selectedStatId === 1 && <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">Gedaald</th>}
        {selectedStatId === 2 && <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">Gestegen</th>}
      </tr>
    </thead>
  );
}