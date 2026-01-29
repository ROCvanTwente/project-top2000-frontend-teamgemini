import { useState, useEffect } from 'react';
import { Pagination, PaginationItem } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { StatisticsTableHeader } from './StatisticsTableHeader';
import { StatisticsTableRow } from './StatisticsTableRow';

interface Statistic {
  vorigJaar: number;
  plaatsenGedaald: number;
  positie: number;
  titel: string;
  artiest: string;
  uitgiftejaar: number;
  songId?: number;
  artistId?: number;
}

interface Props {
  data: any; 
  selectedStatId: number;
  onNavigate: (page: string, params?: any) => void;
}

export function StatisticsTable({ data, selectedStatId, onNavigate }: Props) {
  const [page, setPage] = useState(1);
  const [jumpInput, setJumpInput] = useState<string>("");

  const rowsPerPage = 10;
  const safeData: Statistic[] = Array.isArray(data) ? data : data?.$values ?? [];

  useEffect(() => {
    setPage(1); 
    setJumpInput("");
  }, [data]);

  if (!safeData || safeData.length === 0) {
    return <p className="text-gray-500 text-center italic mt-4">Geen resultaten gevonden.</p>;
  }

  const startIndex = (page - 1) * rowsPerPage;
  const currentData = safeData.slice(startIndex, startIndex + rowsPerPage);
  const pageCount = Math.ceil(safeData.length / rowsPerPage);

  // AANGEPAST: Scrollen weggehaald!
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    // window.scrollTo(...) is hier nu ook WEG
  };

  const handleManualJump = () => {
    if (!jumpInput) return;
    let targetPage = parseInt(jumpInput);
    if (isNaN(targetPage)) return;

    if (targetPage < 1) targetPage = 1;
    if (targetPage > pageCount) targetPage = pageCount;

    setPage(targetPage);
    setJumpInput(""); 
    // window.scrollTo(...) ook hier WEG
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleManualJump();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto shadow-sm border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <StatisticsTableHeader selectedStatId={selectedStatId} />
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((item, index) => (
              <StatisticsTableRow 
                key={index} 
                item={item} 
                selectedStatId={selectedStatId} 
                rank={startIndex + index + 1}
                onNavigate={onNavigate} 
              />
            ))}
          </tbody>
        </table>
      </div>

      {pageCount > 1 && (
        <div className="flex flex-col items-center justify-center mt-4 gap-3">
          
          {/* 1. De Pagination Bolletjes (MET pijltjes terug) */}
          <Pagination
            count={pageCount}
            page={page}
            onChange={handlePageChange}
            color="standard"
            siblingCount={2}
            renderItem={(item) => (
              <PaginationItem
                slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                {...item}
              />
            )}
          />

          {/* 2. De Input + GO Knop */}
          <div className="flex items-center gap-2">            
            <input 
              type="number"
              className="w-16 p-1.5 text-sm border border-gray-300 rounded text-center outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder="#"
              value={jumpInput}
              onChange={(e) => setJumpInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            
            <button 
              onClick={handleManualJump}
              className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold py-2 px-4 rounded transition-colors uppercase"
            >
              GO
            </button>
          </div>
        </div>
      )}
    </div>
  );
}