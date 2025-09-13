import { useState, useMemo, useCallback, useEffect } from 'react';
import { TableContext } from './TableContextDef';
import { DEFAULT_PAGE_SIZE } from './TableContextDef';
import { fetchBeers } from '../services/api';

export const TableProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const MAX_ITEMS = 90;
  const ITEMS_PER_PAGE = DEFAULT_PAGE_SIZE;
  
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Convert filters to API parameters
      const apiParams = {
        page: 1,
        perPage: ITEMS_PER_PAGE,
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
      setCurrentPage(1);
      setStartPage(1);
      setHasMore(beers.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Failed to load beers:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const trimData = useCallback((newData) => {
    if (newData.length > MAX_ITEMS) {
      const excess = newData.length - MAX_ITEMS;
      if (excess > ITEMS_PER_PAGE) {
        // Remove whole pages from the start
        const pagesToRemove = Math.floor(excess / ITEMS_PER_PAGE);
        newData = newData.slice(pagesToRemove * ITEMS_PER_PAGE);
        setStartPage(prev => prev + pagesToRemove);
      } else {
        // Remove items from the start
        newData = newData.slice(excess);
        setStartPage(prev => prev + 1);
      }
    }
    return newData;
  }, []);

  const loadMoreData = useCallback(async () => {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    try {
      const nextPage = currentPage + 1;
      const apiParams = {
        page: nextPage,
        perPage: ITEMS_PER_PAGE,
        ...(filters.name && { beerName: filters.name }),
        ...(filters.abv_gt && { abvGt: filters.abv_gt }),
        ...(filters.abv_lt && { abvLt: filters.abv_lt }),
        ...(filters.ibu_gt && { ibuGt: filters.ibu_gt }),
        ...(filters.ibu_lt && { ibuLt: filters.ibu_lt }),
        ...(filters.ebc_gt && { ebcGt: filters.ebc_gt }),
        ...(filters.ebc_lt && { ebcLt: filters.ebc_lt }),
        ...(filters.food && { food: filters.food }),
      };

      const newBeers = await fetchBeers(apiParams);
      if (newBeers.length > 0) {
        setData(prevData => {
          const updatedData = [...prevData, ...newBeers];
          return trimData(updatedData);
        });
        setCurrentPage(nextPage);
        setHasMore(newBeers.length === ITEMS_PER_PAGE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load more beers:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters, hasMore, isLoading, currentPage, trimData]);

  const loadPreviousData = useCallback(async () => {
    if (startPage <= 1 || isLoading) return;

    setIsLoading(true);
    try {
      const prevPage = startPage - 1;
      const apiParams = {
        page: prevPage,
        perPage: ITEMS_PER_PAGE,
        ...(filters.name && { beerName: filters.name }),
        ...(filters.abv_gt && { abvGt: filters.abv_gt }),
        ...(filters.abv_lt && { abvLt: filters.abv_lt }),
        ...(filters.ibu_gt && { ibuGt: filters.ibu_gt }),
        ...(filters.ibu_lt && { ibuLt: filters.ibu_lt }),
        ...(filters.ebc_gt && { ebcGt: filters.ebc_gt }),
        ...(filters.ebc_lt && { ebcLt: filters.ebc_lt }),
        ...(filters.food && { food: filters.food }),
      };

      const prevBeers = await fetchBeers(apiParams);
      if (prevBeers.length > 0) {
        setData(prevData => {
          const updatedData = [...prevBeers, ...prevData];
          // When loading previous data, trim from the end instead of the beginning
          if (updatedData.length > MAX_ITEMS) {
            const excess = updatedData.length - MAX_ITEMS;
            return updatedData.slice(0, updatedData.length - excess);
          }
          return updatedData;
        });
        setStartPage(prevPage);
      }
    } catch (error) {
      console.error('Failed to load previous beers:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters, isLoading, startPage, ITEMS_PER_PAGE]);

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
    isLoading,
    loadMoreData,
    loadPreviousData,
    hasMore,
    startPage,
    currentPage
  };

  return (
    <TableContext.Provider value={value}>
      {children}
    </TableContext.Provider>
  );
};