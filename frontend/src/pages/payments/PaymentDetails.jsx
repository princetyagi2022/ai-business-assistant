import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Alert, Box, Button, Card, CardContent, Chip, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Grid, Typography,
} from '@mui/material';
import PageHeader from '@/components/common/PageHeader';
import { formatCurrency, formatDateTime } from '@/utils/formatters';
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

const PaymentDetails = () => {
  const { id } = useParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refundDialog, setRefundDialog] = useState(false);
  const [refunding, setRefunding] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        setPayment(await paymentService.getById(id));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load payment.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleRefund = async () => {
    setRefunding(true);
    try {
      const updated = await paymentService.refund(id);
      setPayment(updated);
      setRefundDialog(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Refund failed.');
    } finally {
      setRefunding(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 260 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !payment) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <>
      <PageHeader
        title={`Invoice ${payment?.invoiceNumber || ''}`}
        breadcrumbs={[{ label: 'Payments', to: '/payments' }, { label: payment?.invoiceNumber || '' }]}
        actions={
          payment?.status === 'SUCCESS' && (
            <Button variant="outlined" color="warning" onClick={() => setRefundDialog(true)}>
              Refund
            </Button>
          )
        }
      />
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">Status</Typography>
              <Typography><Chip label={payment?.status} size="small" color={statusColor(payment?.status)} /></Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">Payment Method</Typography>
              <Typography>{payment?.paymentMethod || '—'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">Amount</Typography>
              <Typography>{formatCurrency(payment?.amount, 'INR')}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">GST (18%)</Typography>
              <Typography>{formatCurrency(payment?.gstAmount, 'INR')}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">Total</Typography>
              <Typography fontWeight={600}>{formatCurrency(payment?.totalAmount, 'INR')}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">Currency</Typography>
              <Typography>{payment?.currency || 'INR'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">User</Typography>
              <Typography>{payment?.user || '—'} ({payment?.userEmail || ''})</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">Project</Typography>
              <Typography>{payment?.project || '—'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">Description</Typography>
              <Typography>{payment?.description || '—'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">Created</Typography>
              <Typography>{formatDateTime(payment?.createdAt)}</Typography>
            </Grid>
            {payment?.refundId && (
              <>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Refund ID</Typography>
                  <Typography>{payment.refundId}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="caption" color="text.secondary">Refund Status</Typography>
                  <Typography><Chip label={payment.refundStatus} size="small" color="warning" /></Typography>
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
      </Card>

      <Dialog open={refundDialog} onClose={() => setRefundDialog(false)}>
        <DialogTitle>Process Refund</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to refund <strong>{formatCurrency(payment?.totalAmount, 'INR')}</strong> for invoice {payment?.invoiceNumber}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRefundDialog(false)} disabled={refunding}>Cancel</Button>
          <Button onClick={handleRefund} color="warning" variant="contained" disabled={refunding}>
            {refunding ? 'Processing...' : 'Confirm Refund'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PaymentDetails;
