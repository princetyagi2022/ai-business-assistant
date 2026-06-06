import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Alert, Link, Box } from '@mui/material';
import AuthFormHeader from '@/components/auth/AuthFormHeader';
import FormTextField from '@/components/forms/FormTextField';
import { forgotPasswordSchema } from '@/utils/validators';
import authService from '@/services/authService';

const ForgotPasswordPage = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { control, handleSubmit, formState: { isSubmitting } } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data) => {
    setError('');
    setMessage('');
    try {
      await authService.forgotPassword(data.email);
      setMessage('If an account exists, a reset link has been sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send reset email.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <AuthFormHeader title="Forgot password" subtitle="Enter your email to receive a reset link" />
      {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <FormTextField name="email" control={control} label="Email" type="email" />
      <Button type="submit" variant="contained" fullWidth size="large" disabled={isSubmitting}>
        Send reset link
      </Button>
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Link component={RouterLink} to="/auth/login" variant="body2">
          Back to sign in
        </Link>
      </Box>
    </Box>
  );
};

export default ForgotPasswordPage;
