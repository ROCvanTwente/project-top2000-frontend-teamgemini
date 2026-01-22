import { useState, useEffect } from 'react';
import { Pagination, PaginationItem } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Importeer je nieuwe losse bestanden
import { StatisticsTableHeader } from './StatisticsTableHeader';
import { StatisticsTableRow } from './StatisticsTableRow';

interface Props {
  data: any[];
  selectedStatId: number;
}

export function StatisticsTable({ data, selectedStatId }: Props) {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    setPage(1);
  }, [data]);

  if (!data || data.length === 0) {
    return <p className="text-gray-500 text-center italic mt-4">Geen resultaten gevonden.</p>;
  }

  // Paginering logica
  const startIndex = (page - 1) * rowsPerPage;
  const currentData = data.slice(startIndex, startIndex + rowsPerPage);
  const pageCount = Math.ceil(data.length / rowsPerPage);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto shadow-sm border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          
          <StatisticsTableHeader selectedStatId={selectedStatId} />

          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((item, index) => (
              <StatisticsTableRow key={index} item={item} selectedStatId={selectedStatId} 
              />
            ))}
          </tbody>
          
        </table>
      </div>

      {pageCount > 1 && (
        <div className="flex justify-center mt-2">
          <Pagination
            count={pageCount} page={page} onChange={handlePageChange}
            renderItem={(item) => (
              <PaginationItem
                slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
                {...item}
              />
            )}
          />
        </div>
      )}
    </div>
  );
}