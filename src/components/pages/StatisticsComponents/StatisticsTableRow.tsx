interface Props {
  item: any; 
  selectedStatId: number;
}

export function StatisticsTableRow({ item, selectedStatId }: Props) {
  const isArtistMode = selectedStatId === 10;
  
  // FIX: Check ook op 'positieVorigJaar' voor de lijst 'Verdwenen' (ID 5)
  // De '|| "-"' zorgt dat Evergreens (die geen positie hebben in jouw SP) gewoon een streepje krijgen
  const positie = item.positie || item.hoogsteNotering || item.positieVorigJaar || "-";

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {positie}
      </td>

      {isArtistMode ? (
        <>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{item.naam}</td>
          <td className="px-6 py-4 text-sm text-gray-700">{item.aantalLiedjes}</td>
          {/* NIEUW: Toon gemiddelde positie (komt uit je SP fix of DTO) */}
          <td className="px-6 py-4 text-sm text-gray-500">{item.gemiddeldePositie || "-"}</td>
        </>
      ) : (
        <>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.titel || "-"}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.artiest || "-"}</td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.uitgiftejaar || "-"}</td>
          
          {/* NIEUW: Toon Top 2000 jaar bij eenmalige noteringen */}
          {selectedStatId === 9 && (
             <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">{item.top2000Jaar || "-"}</td>
          )}
        </>
      )}

      {selectedStatId === 1 && <td className="px-6 py-4 text-sm text-red-600 font-bold">-{item.plaatsenGedaald}</td>}
      {selectedStatId === 2 && <td className="px-6 py-4 text-sm text-green-600 font-bold">+{item.plaatsenGestegen}</td>}
    </tr>
  );
}