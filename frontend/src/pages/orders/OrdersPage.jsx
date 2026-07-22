import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Chip,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import PageHeader from '@/components/common/PageHeader';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import SearchBar from '@/components/common/SearchBar';
import orderService, { ORDER_STATUSES } from '@/services/orderService';
import { formatCurrency, formatDate } from '@/utils/formatters';

const STATUS_COLORS = {
  PENDING: 'warning',
  PROCESSING: 'info',
  SHIPPED: 'primary',
  DELIVERED: 'success',
  CANCELLED: 'error',
};

const OrdersPage = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [savingId, setSavingId] = useState(null);
  const [toast, setToast] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getAll();
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter(
      (r) =>
        String(r.orderNumber || '').toLowerCase().includes(term) ||
        String(r.customer || '').toLowerCase().includes(term),
    );
  }, [rows, search]);

  const changeStatus = async (row, status) => {
    if (status === row.status) return;
    setSavingId(row.id);
    try {
      await orderService.updateStatus(row.id, status);
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, status } : r)));
      setToast({ severity: 'success', message: `Order ${row.orderNumber} set to ${status}` });
    } catch (err) {
      setToast({ severity: 'error', message: err.response?.data?.message || 'Failed to update status' });
    } finally {
      setSavingId(null);
    }
  };

  if (loading) return <Loader message="Loading orders…" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <Box>
      <PageHeader
        title="Orders"
        subtitle="Customer orders — admin, manager and employee can update fulfilment status"
      />

      <Box sx={{ mb: 2, maxWidth: 360 }}>
        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search order or customer…" />
      </Box>

      {filtered.length === 0 ? (
        <EmptyState title="No orders" description="No customer orders found." />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order #</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell>Order date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>{row.orderNumber}</TableCell>
                  <TableCell>{row.customer}</TableCell>
                  <TableCell align="right">{formatCurrency(row.totalAmount)}</TableCell>
                  <TableCell>{formatDate(row.orderDate)}</TableCell>
                  <TableCell>
                    <Select
                      size="small"
                      value={ORDER_STATUSES.includes(row.status) ? row.status : ''}
                      disabled={savingId === row.id}
                      onChange={(e) => changeStatus(row, e.target.value)}
                      renderValue={(value) => (
                        <Chip size="small" label={value} color={STATUS_COLORS[value] || 'default'} />
                      )}
                      sx={{ minWidth: 150 }}
                    >
                      {ORDER_STATUSES.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {toast && (
          <Alert severity={toast.severity} onClose={() => setToast(null)} variant="filled">
            {toast.message}
          </Alert>
        )}
      </Snackbar>
    </Box>
  );
};

export default OrdersPage;
