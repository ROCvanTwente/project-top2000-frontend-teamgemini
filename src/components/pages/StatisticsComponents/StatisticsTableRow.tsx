interface Props {
  item: any; // Je kunt dit later vervangen door een echt Type, bijv. 'Song'
  selectedStatId: number;
}

export function StatisticsTableRow({ item, selectedStatId }: Props) {
  const isArtistMode = selectedStatId === 10;
  // Fallback voor als data soms null is
  const positie = item.positie || item.hoogsteNotering || "-";

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {positie}
      </td>

      {isArtistMode ? (
        <>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{item.naam}</td>
          <td className="px-6 py-4 text-sm text-gray-700">{item.aantalLiedjes}</td>
        </>
      ) : (
        <>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.titel || "-"}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.artiest || "-"}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.uitgiftejaar || "-"}</td>
        </>
      )}

      {selectedStatId === 1 && <td className="px-6 py-4 text-sm text-red-600 font-bold">-{item.plaatsenGedaald}</td>}
      {selectedStatId === 2 && <td className="px-6 py-4 text-sm text-green-600 font-bold">+{item.plaatsenGestegen}</td>}
    </tr>
  );
}