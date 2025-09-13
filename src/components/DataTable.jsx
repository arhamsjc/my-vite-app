import { useMemo } from 'react';
import { VirtualTable } from './VirtualTable';
import { PaginationControls } from './PaginationControls';
import { AdvancedFilters } from './AdvancedFilters';
import { useTable } from '../hooks/useTable';
import './DataTable.css';

export const DataTable = () => {
  const { isLoading } = useTable();

  const columns = useMemo(
    () => [
      {
        header: 'Name',
        accessorKey: 'name',
      },
      {
        header: 'Tagline',
        accessorKey: 'tagline',
      },
      {
        header: 'First Brewed',
        accessorKey: 'first_brewed',
      },
      {
        header: 'ABV',
        accessorKey: 'abv',
        cell: info => `${info.getValue()}%`,
      },
      {
        header: 'IBU',
        accessorKey: 'ibu',
      },
      {
        header: 'EBC',
        accessorKey: 'ebc',
      },
    ],
    []
  );

  return (
    <div className="data-table">
      <div className="filters-section">
        <div className="filters-header">
          <h3>Beer Catalog</h3>
          {isLoading && <span>Loading...</span>}
        </div>
        <AdvancedFilters />
      </div>
      <VirtualTable columns={columns} />
      <PaginationControls />
    </div>
  );
};