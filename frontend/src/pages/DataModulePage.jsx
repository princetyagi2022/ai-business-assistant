import { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Chip, CircularProgress } from '@mui/material';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import TablePagination from '@/components/common/Pagination';
import TableToolbar from '@/components/common/TableToolbar';
import api, { unwrap } from '@/services/api';
import { useTableControls } from '@/hooks/useTableControls';
import { formatCurrency } from '@/utils/formatters';
import { inferFilterConfigs } from '@/utils/tableFilters';

const titleCase = (value) =>
  value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const renderValue = (key, value) => {
  if (value === null || value === undefined || value === '') return '-';
  if (/status|type|segment/i.test(key)) {
    return <Chip label={String(value)} size="small" />;
  }
  if (/amount|price|salary|cost|value|revenue|budget|profit|spent/i.test(key) && typeof value === 'number') {
    return formatCurrency(value);
  }
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number') return Number.isInteger(value) ? value : value.toFixed(2);
  return String(value);
};

const buildColumns = (rows) => {
  const first = rows[0] || {};
  return Object.keys(first)
    .filter((key) => key !== 'id')
    .slice(0, 8)
    .map((key) => ({
      id: key,
      label: titleCase(key),
      render: (row) => renderValue(key, row[key]),
    }));
};

const normalizeRows = (rows = []) =>
  rows.map((row, index) => ({
    id: row.id ?? row.order_id ?? row.employee_id ?? row.sku ?? row.email ?? index + 1,
    ...row,
  }));

const DataModulePage = ({ title, subtitle, endpoint }) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRows = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get(endpoint).then(unwrap);
        setRows(normalizeRows(Array.isArray(data) ? data : data?.items || data?.rows || []));
      } catch (err) {
        setError(err.response?.data?.detail || `Failed to load ${title.toLowerCase()} data.`);
      } finally {
        setLoading(false);
      }
    };

    loadRows();
  }, [endpoint, title]);

  const columns = useMemo(() => buildColumns(rows), [rows]);
  const tableKeys = useMemo(() => columns.map((column) => column.id), [columns]);
  const filterConfigs = useMemo(() => inferFilterConfigs(rows, tableKeys), [rows, tableKeys]);
  const {
    search: tableSearch,
    setSearch: setTableSearch,
    filters,
    setFilter,
    resetFilters,
    filterOptions,
    filteredRows,
    paginatedRows,
    pagination,
  } = useTableControls({
    rows,
    searchKeys: tableKeys,
    filterConfigs,
  });

  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />
      <TableToolbar
        search={tableSearch}
        onSearchChange={setTableSearch}
        searchPlaceholder={`Search ${title.toLowerCase()}...`}
        filters={filters}
        filterOptions={filterOptions}
        onFilterChange={setFilter}
        onReset={resetFilters}
      />
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 260 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <DataTable columns={columns} rows={paginatedRows} emptyMessage={`No ${title.toLowerCase()} found`} />
          <TablePagination
            page={pagination.page}
            size={pagination.size}
            totalPages={pagination.totalPages}
            totalItems={filteredRows.length}
            onPageChange={pagination.setPage}
            onSizeChange={pagination.setSize}
          />
        </>
      )}
    </>
  );
};

export default DataModulePage;
