interface Props {
  item: any; 
  selectedStatId: number;
  rank: number; 
  onNavigate: (page: string, params?: any) => void;
}

export function StatisticsTableRow({ item, selectedStatId, rank, onNavigate }: Props) {
  const isArtistMode = selectedStatId === 10;
  
  const positie = item.positie || item.hoogsteNotering || item.positieVorigJaar || "-";

  // Jouw styling met het rode hover-effect en de kleine 'pop' (scale)
  const linkStyle = "text-gray-700 hover:text-red-600 cursor-pointer font-medium transition-all duration-200 inline-block hover:scale-105 origin-left";

  const getSongId = () => item.songId || item.SongId;
  const getArtistId = () => item.artistId || item.ArtistId;

  return (
    <tr className="hover:bg-gray-50 transition-colors group">
      
      {/* Rank Kolom (Nr.) */}
      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-black-400">
        {rank}
      </td>

      {/* Top 2000 Positie Kolom - VERBERGEN BIJ EVERGREENS (ID 3) */}
      {selectedStatId !== 3 && (
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black-900">
          {positie}
        </td>
      )}

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
          <td className="px-6 py-4 text-sm text-black-700">{item.aantalLiedjes}</td>
          <td className="px-6 py-4 text-sm text-black-500">
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
          <td className="px-6 py-4 whitespace-nowrap text-sm text-black-500">{item.uitgiftejaar || "-"}</td>
          
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