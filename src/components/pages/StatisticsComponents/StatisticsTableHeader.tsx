interface Props {
  selectedStatId: number;
}

export function StatisticsTableHeader({ selectedStatId }: Props) {
  const isArtistMode = selectedStatId === 10;
  // Bij "Verdwenen" (ID 5) is de positie eigenlijk de positie van vorig jaar
  const positionLabel = selectedStatId === 5 ? "Positie Vorig Jaar" : "#";

  return (
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">
          {positionLabel}
        </th>
        
        {isArtistMode ? (
          <>
            <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">Artiest Naam</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">Aantal Nummers</th>
            {/* NIEUW: Gemiddelde positie tonen */}
            <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">Gem. Positie</th>
          </>
        ) : (
          <>
            <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">Titel</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">Artiest</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">Jaar</th>
            
            {/* NIEUW: Bij eenmalige noteringen (ID 9) tonen we OOK het Top 2000 jaar */}
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