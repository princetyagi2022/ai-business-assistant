import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Alert, Box, Button, Card, CardContent, CircularProgress,
  Grid, Typography, Divider,
} from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import PageHeader from '@/components/common/PageHeader';
import FormTextField from '@/components/forms/FormTextField';
import paymentService from '@/services/paymentService';

const formatINR = (n) =>
  (Number(n) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const PaymentCreate = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const { control, handleSubmit, watch, formState: { isSubmitting } } = useForm({
    defaultValues: { amount: '', description: '', customerName: '', customerEmail: '', customerPhone: '' },
  });

  const amount = watch('amount');
  const numericAmount = parseFloat(amount) || 0;
  const gst = numericAmount * 0.18;
  const total = numericAmount + gst;

  const onSubmit = async (values) => {
    setError('');
    setProcessing(true);
    try {
      // Step 1: Create order on backend
      const order = await paymentService.createOrder({
        amount: values.amount,
        description: values.description,
        customerName: values.customerName,
        customerEmail: values.customerEmail,
        customerPhone: values.customerPhone,
      });

      // Step 2: Process payment
      const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID || order.razorpayKeyId || '';

      if (razorpayKeyId && window.Razorpay) {
        // Live mode - open Razorpay checkout
        await new Promise((resolve, reject) => {
          const options = {
            key: razorpayKeyId,
            amount: Math.round(order.totalAmount * 100),
            currency: order.currency || 'INR',
            name: 'AI Business Assistant',
            description: order.description || 'Payment',
            order_id: order.razorpayOrderId,
            prefill: {
              name: values.customerName || '',
              email: values.customerEmail || '',
              contact: values.customerPhone || '',
            },
            theme: { color: '#1976d2' },
            handler: (response) => resolve(response),
            modal: {
              ondismiss: () => reject(new Error('Payment cancelled by user')),
            },
          };
          const rzp = new window.Razorpay(options);
          rzp.on('payment.failed', (resp) => reject(new Error(resp.error?.description || 'Payment failed')));
          rzp.open();
        }).then(async (paymentResponse) => {
          await paymentService.verify({
            razorpay_order_id: paymentResponse.razorpay_order_id,
            razorpay_payment_id: paymentResponse.razorpay_payment_id,
            razorpay_signature: paymentResponse.razorpay_signature,
            paymentMethod: 'RAZORPAY',
          });
        });
      } else {
        // Demo mode - simulate payment
        await paymentService.verify({
          razorpay_order_id: order.razorpayOrderId,
          razorpay_payment_id: 'pay_demo_' + Date.now(),
          razorpay_signature: 'demo_signature',
          paymentMethod: 'CARD',
        });
      }

      navigate(`/payments/${order.id}`);
    } catch (err) {
      setError(err.message || err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <PageHeader
        title="New Payment"
        breadcrumbs={[{ label: 'Payments', to: '/payments' }, { label: 'Create' }]}
      />
      <Card sx={{ maxWidth: 640 }}>
        <CardContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            {/* Amount Section */}
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Payment Amount
            </Typography>
            <FormTextField
              name="amount"
              control={control}
              label="Amount (INR)"
              type="number"
              inputProps={{ min: 1, step: '0.01' }}
              placeholder="Enter amount"
            />

            <Divider sx={{ my: 2 }} />

            {/* Customer Details */}
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Customer Details (optional)
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormTextField name="customerName" control={control} label="Full Name" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormTextField name="customerEmail" control={control} label="Email" type="email" />
              </Grid>
              <Grid item xs={12}>
                <FormTextField name="customerPhone" control={control} label="Phone Number" type="tel" />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            {/* Description */}
            <FormTextField name="description" control={control} label="Description / Notes" multiline rows={2} />

            {/* Price Breakdown */}
            <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>Price Breakdown</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                <Typography variant="body2">&#x20B9;{formatINR(numericAmount)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" color="text.secondary">GST (18%)</Typography>
                <Typography variant="body2">&#x20B9;{formatINR(gst)}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1" fontWeight={700}>Total</Typography>
                <Typography variant="subtitle1" fontWeight={700} color="primary">
                  &#x20B9;{formatINR(total)}
                </Typography>
              </Box>
            </Box>

            {/* Razorpay status */}
            {!import.meta.env.VITE_RAZORPAY_KEY_ID && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Demo mode: Payment will be simulated. For live payments, set{' '}
                <code>VITE_RAZORPAY_KEY_ID</code> in .env with your Razorpay key.
              </Alert>
            )}

            {/* Actions */}
            <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={processing ? <CircularProgress size={20} color="inherit" /> : <PaymentIcon />}
                disabled={isSubmitting || processing || numericAmount <= 0}
              >
                {processing ? 'Processing...' : `Pay \u20B9${formatINR(total)}`}
              </Button>
              <Button variant="outlined" size="large" onClick={() => navigate('/payments')}>
                Cancel
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default PaymentCreate;
