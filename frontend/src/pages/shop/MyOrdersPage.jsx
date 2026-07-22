import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Stack,
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PageHeader from '@/components/common/PageHeader';
import Loader from '@/components/common/Loader';
import ErrorState from '@/components/common/ErrorState';
import EmptyState from '@/components/common/EmptyState';
import storefrontService from '@/services/storefrontService';
import { formatCurrency, formatDateTime } from '@/utils/formatters';

const statusColor = (status) => {
  switch ((status || '').toUpperCase()) {
    case 'COMPLETED':
    case 'DELIVERED':
      return 'success';
    case 'CANCELLED':
      return 'error';
    case 'SHIPPED':
      return 'info';
    default:
      return 'warning';
  }
};

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await storefrontService.getMyOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <Loader message="Loading your orders…" />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <Box>
      <PageHeader title="My Orders" subtitle="Track the orders you have placed" />

      {orders.length === 0 ? (
        <EmptyState
          icon={ReceiptLongIcon}
          title="No orders yet"
          description="When you place an order from the Shop, it will appear here."
        />
      ) : (
        <Stack spacing={2}>
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  justifyContent="space-between"
                  alignItems={{ xs: 'flex-start', sm: 'center' }}
                  spacing={1}
                >
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700}>
                      {order.orderNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Placed {formatDateTime(order.orderDate)}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Chip label={order.status} color={statusColor(order.status)} size="small" />
                    <Typography variant="h6" color="primary">
                      {formatCurrency(order.totalAmount)}
                    </Typography>
                  </Stack>
                </Stack>

                {order.shippingAddress && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Ship to: {order.shippingAddress}
                  </Typography>
                )}

                <Divider sx={{ my: 1.5 }} />

                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Qty</TableCell>
                      <TableCell align="right">Unit price</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(order.items || []).map((item, index) => (
                      <TableRow key={`${order.id}-${index}`}>
                        <TableCell>{item.product}</TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">{formatCurrency(item.unitPrice)}</TableCell>
                        <TableCell align="right">{formatCurrency(item.totalPrice)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default MyOrdersPage;
