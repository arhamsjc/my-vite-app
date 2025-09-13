import { useVirtualizer } from '@tanstack/react-virtual';
import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { useRef } from 'react';
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
  const { filteredData, sorting, setSorting } = useTable();
  console.log('Filtered Data:', filteredData);
  const parentRef = useRef(null);

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
        </div>
      </div>
    </div>
  );
};