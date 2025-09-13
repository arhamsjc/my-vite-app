import { useTable } from '../hooks/useTable';
import { PAGE_SIZE_OPTIONS } from '../context/TableContextDef';

export const PaginationControls = () => {
  const { pagination, setPagination, isLoading } = useTable();
  const { pageIndex, pageSize } = pagination;

  const handlePageSizeChange = (e) => {
    setPagination(prev => ({
      ...prev,
      pageSize: Number(e.target.value),
      pageIndex: 0, // Reset to first page when changing page size
    }));
  };

  const handlePreviousPage = () => {
    setPagination(prev => ({
      ...prev,
      pageIndex: Math.max(0, prev.pageIndex - 1),
    }));
  };

  const handleNextPage = () => {
    setPagination(prev => ({
      ...prev,
      pageIndex: prev.pageIndex + 1,
    }));
  };

  return (
    <div className="pagination-controls">
      <div className="pagination-info">
        <span>Page {pageIndex + 1}</span>
        <select 
          value={pageSize} 
          onChange={handlePageSizeChange}
          disabled={isLoading}
        >
          {PAGE_SIZE_OPTIONS.map(size => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>
      <div className="pagination-actions">
        <button 
          onClick={handlePreviousPage} 
          disabled={pageIndex === 0 || isLoading}
        >
          Previous
        </button>
        <button 
          onClick={handleNextPage}
          disabled={isLoading}
        >
          Next
        </button>
      </div>
    </div>
  );
};