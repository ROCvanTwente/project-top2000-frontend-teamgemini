interface Props {
  item: any; 
  selectedStatId: number;
  rank: number; // <--- NIEUW: We verwachten nu een rank nummer
  onNavigate: (page: string, params?: any) => void;
}

export function StatisticsTableRow({ item, selectedStatId, rank, onNavigate }: Props) {
  const isArtistMode = selectedStatId === 10;
  
  const positie = item.positie || item.hoogsteNotering || item.positieVorigJaar || "-";
  const linkStyle = "text-gray-700 hover:text-blue-600 hover:underline cursor-pointer font-medium transition-colors";

  const getSongId = () => item.songId || item.SongId;
  const getArtistId = () => item.artistId || item.ArtistId;

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      
      {/* NIEUW: De Rank Kolom (1, 2, 3...) */}
      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-black-400">
        {rank}
      </td>

      {/* OUDE POSITIE KOLOM (Nu Top 2000 Positie) */}
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black-900">
        {positie}
      </td>

      {isArtistMode ? (
        <>
          <td className="px-6 py-4 whitespace-nowrap text-sm">
            <span 
              className={linkStyle}
              onClick={() => onNavigate('artist-detail', { artistId: getArtistId() })}
            >
              {item.naam}
            </span>
          </td>
          <td className="px-6 py-4 text-sm text-gray-700">{item.aantalLiedjes}</td>
          <td className="px-6 py-4 text-sm text-gray-500">
            {item.gemiddeldePositie ? Math.round(item.gemiddeldePositie) : "-"}
          </td>
        </>
      ) : (
        <>
          <td className="px-6 py-4 whitespace-nowrap text-sm">
            <span 
              className={linkStyle}
              onClick={() => onNavigate('song-detail', { songId: getSongId() })}
            >
              {item.titel || "-"}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm">
            <span 
              className={linkStyle}
              onClick={() => onNavigate('artist-detail', { artistId: getArtistId() })}
            >
              {item.artiest || "-"}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.uitgiftejaar || "-"}</td>
          
          {selectedStatId === 9 && (
             <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-semibold">{item.top2000Jaar || "-"}</td>
          )}
        </>
      )}

      {selectedStatId === 1 && <td className="px-6 py-4 text-sm text-red-600 font-bold">-{item.plaatsenGedaald}</td>}
      {selectedStatId === 2 && <td className="px-6 py-4 text-sm text-green-600 font-bold">+{item.plaatsenGestegen}</td>}
    </tr>
  );
}