interface Props {
  selectedStatId: number;
}

export function StatisticsTableHeader({ selectedStatId }: Props) {
  const isArtistMode = selectedStatId === 10;

  return (
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">#</th>
        
        {isArtistMode ? (
          <>
            <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">Artiest Naam</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aantal Nummers</th>
          </>
        ) : (
          <>
            <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">Titel</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">Artiest</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-red-500 uppercase tracking-wider">Jaar</th>
          </>
        )}

        {selectedStatId === 1 && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gedaald</th>}
        {selectedStatId === 2 && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gestegen</th>}
      </tr>
    </thead>
  );
}