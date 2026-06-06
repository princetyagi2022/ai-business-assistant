import { useState } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Alert, Link, Box } from '@mui/material';
import AuthFormHeader from '@/components/auth/AuthFormHeader';
import FormTextField from '@/components/forms/FormTextField';
import { verifyEmailSchema } from '@/utils/validators';
import authService from '@/services/authService';

const VerifyEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const { control, handleSubmit, formState: { isSubmitting } } = useForm({
    resolver: yupResolver(verifyEmailSchema),
    defaultValues: { email: location.state?.email || '', code: '' },
  });

  const onSubmit = async (data) => {
    setError('');
    try {
      await authService.verifyEmail(data);
      navigate('/auth/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <AuthFormHeader title="Verify email" subtitle="Enter the 6-digit code sent to your email" />
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <FormTextField name="email" control={control} label="Email" type="email" />
      <FormTextField name="code" control={control} label="Verification code" inputProps={{ maxLength: 6 }} />
      <Button type="submit" variant="contained" fullWidth size="large" disabled={isSubmitting}>
        Verify
      </Button>
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Link component={RouterLink} to="/auth/login" variant="body2">
          Back to sign in
        </Link>
      </Box>
    </Box>
  );
};

export default VerifyEmailPage;
