import { useState, useMemo, useCallback, useEffect } from 'react';
import { TableContext } from './TableContextDef';
import { DEFAULT_PAGE_SIZE } from './TableContextDef';
import { fetchBeers } from '../services/api';

export const TableProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Convert filters to API parameters
      const apiParams = {
        page: pagination.pageIndex + 1,
        perPage: pagination.pageSize,
        ...(filters.name && { beerName: filters.name }),
        ...(filters.abv_gt && { abvGt: filters.abv_gt }),
        ...(filters.abv_lt && { abvLt: filters.abv_lt }),
        ...(filters.ibu_gt && { ibuGt: filters.ibu_gt }),
        ...(filters.ibu_lt && { ibuLt: filters.ibu_lt }),
        ...(filters.ebc_gt && { ebcGt: filters.ebc_gt }),
        ...(filters.ebc_lt && { ebcLt: filters.ebc_lt }),
        ...(filters.food && { food: filters.food }),
      };
      
      const beers = await fetchBeers(apiParams);
      setData(beers);
    } catch (error) {
      console.error('Failed to load beers:', error);
    } finally {
      setIsLoading(false);
    }
  }, [pagination, filters]);

  // Load data when pagination or filters change
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Memoize filter values based on current data
  const uniqueValues = useMemo(() => {
    const values = {};
    if (data && Array.isArray(data) && data.length > 0) {
      Object.keys(data[0]).forEach(column => {
        if (['name', 'first_brewed', 'food_pairing'].includes(column)) {
          values[column] = [...new Set(data.map(item => String(item[column])))];
        }
      });
    }
    return values;
  }, [data]);

  const filteredData = useMemo(() => {
    return data;
  }, [data]);

  const value = {
    data,
    setData,
    filteredData,
    sorting,
    setSorting,
    filters,
    setFilters,
    uniqueValues,
    pagination,
    setPagination,
    isLoading,
  };

  return (
    <TableContext.Provider value={value}>
      {children}
    </TableContext.Provider>
  );
};