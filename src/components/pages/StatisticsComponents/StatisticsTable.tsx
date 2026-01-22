interface Props {
  data: any[];
  selectedStatId: number;
}

export function StatisticsTable({ data, selectedStatId }: Props) {
  if (!data || data.length === 0) {
    return <p className="text-gray-500 text-center italic">Geen resultaten gevonden.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
            {selectedStatId === 10 ? (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artiest Naam</th>
            ) : (
              <>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artiest</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jaar</th>
              </>
            )}
            {selectedStatId === 1 && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gedaald</th>}
            {selectedStatId === 2 && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gestegen</th>}
            {selectedStatId === 10 && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aantal Nummers</th>}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {item.positie || item.hoogsteNotering || "-"}
              </td>
              {selectedStatId === 10 ? (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{item.naam}</td>
              ) : (
                <>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.titel || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.artiest || "-"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.uitgiftejaar || "-"}</td>
                </>
              )}
              {selectedStatId === 1 && <td className="px-6 py-4 text-sm text-red-600 font-bold">-{item.plaatsenGedaald}</td>}
              {selectedStatId === 2 && <td className="px-6 py-4 text-sm text-green-600 font-bold">+{item.plaatsenGestegen}</td>}
              {selectedStatId === 10 && <td className="px-6 py-4 text-sm text-gray-700">{item.aantalLiedjes}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}