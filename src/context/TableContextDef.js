import React from 'react';

const TableContext = React.createContext();

export const DEFAULT_PAGE_SIZE = 30;
export const PAGE_SIZE_OPTIONS = [10, 20, 30, 50, 80];

export { TableContext };