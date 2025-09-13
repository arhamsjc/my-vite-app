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

  const trimData = useCallback((newData, fromDirection = 'bottom', addedCount = 0) => {
    if (newData.length > MAX_ITEMS) {
      const excess = newData.length - MAX_ITEMS;
      let removedCount = 0;

      if (fromDirection === 'bottom') {
        // When loading from bottom, remove from top
        if (excess > ITEMS_PER_PAGE) {
          const pagesToRemove = Math.floor(excess / ITEMS_PER_PAGE);
          newData = newData.slice(pagesToRemove * ITEMS_PER_PAGE);
          setStartPage(prev => prev + pagesToRemove);
          removedCount = pagesToRemove * ITEMS_PER_PAGE;
        } else {
          newData = newData.slice(excess);
          setStartPage(prev => prev + 1);
          removedCount = excess;
        }
      } else {
        // When loading from top, remove from bottom
        if (excess > ITEMS_PER_PAGE) {
          const pagesToRemove = Math.floor(excess / ITEMS_PER_PAGE);
          newData = newData.slice(0, newData.length - (pagesToRemove * ITEMS_PER_PAGE));
          removedCount = pagesToRemove * ITEMS_PER_PAGE;
        } else {
          newData = newData.slice(0, newData.length - excess);
          removedCount = excess;
        }
      }

      // Use requestAnimationFrame to adjust scroll position after the render
      requestAnimationFrame(() => {
        const tableContainer = document.querySelector('.table-container');
        if (tableContainer) {
          const rowHeight = 35; // Height of each row
          if (fromDirection === 'bottom') {
            tableContainer.scrollTop -= (removedCount * rowHeight);
          } else {
            // For previous data, we need to maintain the scroll position relative to existing content
            tableContainer.scrollTop += (addedCount * rowHeight);
          }
        }
      });
    }
    return newData;
  }, [ITEMS_PER_PAGE]);

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
          return trimData(updatedData, 'bottom');
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
  }, [filters, hasMore, isLoading, currentPage, trimData, ITEMS_PER_PAGE]);

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
          return trimData(updatedData, 'top', prevBeers.length);
        });
        setStartPage(prevPage);
      }
    } catch (error) {
      console.error('Failed to load previous beers:', error);
    } finally {
      setIsLoading(false);
    }
  }, [filters, isLoading, startPage, ITEMS_PER_PAGE, trimData]);

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