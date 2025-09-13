import { useVirtualizer } from '@tanstack/react-virtual';
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useRef, useEffect, useCallback } from 'react';
import { useTable } from '../hooks/useTable';

const TableRow = ({ row, virtualRow }) => {
  const { height, start } = virtualRow;
  const cells = row.getVisibleCells();

  return (
    <div
      className="tr"
      style={{
        height: `${height}px`,
        transform: `translateY(${start}px)`,
      }}
    >
      {cells.map(cell => (
        <div key={cell.id} className="td">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </div>
      ))}
    </div>
  );
};

export const VirtualTable = ({ columns }) => {
  const { filteredData, sorting, setSorting, loadMoreData, isLoading } = useTable();
  const parentRef = useRef(null);
  
  const handleScroll = useCallback(() => {
    if (isLoading) return;
    
    const element = parentRef.current;
    if (!element) return;
    
    const { scrollHeight, scrollTop, clientHeight } = element;
    // Load more data when user scrolls to 80% of the table
    if (scrollHeight - scrollTop - clientHeight < scrollHeight * 0.2) {
      loadMoreData();
    }
  }, [isLoading, loadMoreData]);

  useEffect(() => {
    const element = parentRef.current;
    if (!element) return;
    
    element.addEventListener('scroll', handleScroll);
    return () => element.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 10,
  });

  return (
    <div className="table-container" ref={parentRef}>
      <div className="table">
        <div className="thead">
          {table.getHeaderGroups().map(headerGroup => (
            <div key={headerGroup.id} className="tr">
              {headerGroup.headers.map(header => (
                <div
                  key={header.id}
                  className="th"
                  onClick={header.column.getToggleSortingHandler()}
                  style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{
                    asc: ' 🔼',
                    desc: ' 🔽',
                  }[header.column.getIsSorted()] ?? null}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div
          className="tbody"
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map(virtualRow => (
            <TableRow
              key={rows[virtualRow.index].id}
              row={rows[virtualRow.index]}
              virtualRow={virtualRow}
            />
          ))}
          {isLoading && (
            <div
              className="tr loading-row"
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '35px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.9)'
              }}
            >
              <div>Loading more data...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};