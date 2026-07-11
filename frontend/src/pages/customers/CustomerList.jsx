import { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Chip, CircularProgress } from '@mui/material';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import TablePagination from '@/components/common/Pagination';
import TableToolbar from '@/components/common/TableToolbar';
import { useTableControls } from '@/hooks/useTableControls';
import customerService from '@/services/customerService';

const columns = [
  { id: 'name', label: 'Customer' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
  { id: 'distanceKm', label: 'Distance', render: (row) => (
    row.distanceKm === undefined ? '-' : `${row.distanceKm} km`
  )},
  { id: 'orders', label: 'Orders' },
  { id: 'status', label: 'Status', render: (row) => (
    <Chip label={row.status} size="small" color={row.status === 'ACTIVE' ? 'success' : 'default'} />
  )},
];

const CustomerList = ({
  title = 'Customers',
  subtitle = 'Customer directory and engagement',
  searchPlaceholder = 'Search customers...',
}) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await customerService.getAll();
        setCustomers(Array.isArray(data) ? data : data?.items || []);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load customers.');
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const filterConfigs = useMemo(() => [{ id: 'status', label: 'Status' }], []);
  const {
    search,
    setSearch,
    filters,
    setFilter,
    resetFilters,
    filterOptions,
    filteredRows,
    paginatedRows,
    pagination,
  } = useTableControls({
    rows: customers,
    searchKeys: ['name', 'email', 'phone', 'status'],
    filterConfigs,
  });

  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />
      <TableToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder={searchPlaceholder}
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
          <DataTable columns={columns} rows={paginatedRows} />
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

export default CustomerList;
