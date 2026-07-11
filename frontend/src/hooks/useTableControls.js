import { useMemo, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { usePagination } from '@/hooks/usePagination';

const defaultGetValue = (row, key) => row?.[key];

const normalizeValue = (value) => String(value ?? '').toLowerCase();

export const useTableControls = ({
  rows = [],
  searchKeys = [],
  filterConfigs = [],
  getValue = defaultGetValue,
} = {}) => {
  const [search, setSearchValue] = useState('');
  const [filters, setFilters] = useState({});
  const debouncedSearch = useDebounce(search);

  const filterOptions = useMemo(() => filterConfigs.map((filter) => {
    const values = rows
      .map((row) => getValue(row, filter.id))
      .filter((value) => value !== null && value !== undefined && value !== '');
    const uniqueValues = [...new Set(values.map(String))].sort((a, b) => a.localeCompare(b));

    return {
      ...filter,
      options: uniqueValues.map((value) => ({ label: filter.format ? filter.format(value) : value, value })),
    };
  }), [filterConfigs, getValue, rows]);

  const filteredRows = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    const activeFilters = Object.entries(filters).filter(([, value]) => value);

    return rows.filter((row) => {
      const matchesSearch = !query || searchKeys.some((key) =>
        normalizeValue(getValue(row, key)).includes(query),
      );

      const matchesFilters = activeFilters.every(([key, value]) =>
        String(getValue(row, key) ?? '') === String(value),
      );

      return matchesSearch && matchesFilters;
    });
  }, [debouncedSearch, filters, getValue, rows, searchKeys]);

  const pagination = usePagination({ totalItems: filteredRows.length });
  const paginatedRows = useMemo(
    () => filteredRows.slice(pagination.offset, pagination.offset + pagination.size),
    [filteredRows, pagination.offset, pagination.size],
  );

  const setFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
    pagination.setPage(0);
  };

  const setSearch = (value) => {
    setSearchValue(value);
    pagination.setPage(0);
  };

  const resetFilters = () => {
    setSearchValue('');
    setFilters({});
    pagination.setPage(0);
  };

  return {
    search,
    setSearch,
    filters,
    setFilter,
    resetFilters,
    filterOptions,
    filteredRows,
    paginatedRows,
    pagination,
  };
};

export default useTableControls;
