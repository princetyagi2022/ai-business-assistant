import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Chip, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import TablePagination from '@/components/common/Pagination';
import TableToolbar from '@/components/common/TableToolbar';
import { useTableControls } from '@/hooks/useTableControls';
import { formatCurrency, formatDate } from '@/utils/formatters';
import paymentService from '@/services/paymentService';

const statusColor = (status) => {
  switch (status) {
    case 'SUCCESS': return 'success';
    case 'CREATED': return 'warning';
    case 'FAILED': return 'error';
    case 'REFUNDED': return 'default';
    default: return 'default';
  }
};

const PaymentList = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await paymentService.getAll();
        setPayments(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load payments.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const columns = useMemo(() => [
    { id: 'invoiceNumber', label: 'Invoice' },
    { id: 'user', label: 'User', render: (row) => row.user || '—' },
    { id: 'description', label: 'Description', render: (row) => row.description || '—' },
    { id: 'amount', label: 'Amount', render: (row) => formatCurrency(row.amount, 'INR') },
    { id: 'gstAmount', label: 'GST', render: (row) => formatCurrency(row.gstAmount, 'INR') },
    { id: 'totalAmount', label: 'Total', render: (row) => formatCurrency(row.totalAmount, 'INR') },
    { id: 'paymentMethod', label: 'Method', render: (row) => row.paymentMethod ? <Chip label={row.paymentMethod} size="small" variant="outlined" /> : '—' },
    { id: 'status', label: 'Status', render: (row) => <Chip label={row.status} size="small" color={statusColor(row.status)} /> },
    { id: 'createdAt', label: 'Date', render: (row) => formatDate(row.createdAt) },
  ], []);

  const filterConfigs = useMemo(() => [
    { id: 'status', label: 'Status' },
    { id: 'paymentMethod', label: 'Method' },
  ], []);

  const {
    search, setSearch, filters, setFilter, resetFilters, filterOptions,
    filteredRows, paginatedRows, pagination,
  } = useTableControls({
    rows: payments,
    searchKeys: ['invoiceNumber', 'user', 'description', 'status'],
    filterConfigs,
  });

  return (
    <>
      <PageHeader
        title="Payments"
        subtitle="Track invoices, orders, and payment status"
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/payments/create')}>
            New Payment
          </Button>
        }
      />
      <TableToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search payments..."
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
          <DataTable
            columns={columns}
            rows={paginatedRows}
            onRowClick={(row) => navigate(`/payments/${row.id}`)}
          />
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

export default PaymentList;
