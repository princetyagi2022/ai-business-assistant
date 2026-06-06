import { useState } from 'react';
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Alert, Link, Box } from '@mui/material';
import AuthFormHeader from '@/components/auth/AuthFormHeader';
import FormTextField from '@/components/forms/FormTextField';
import PasswordField from '@/components/forms/PasswordField';
import { resetPasswordSchema } from '@/utils/validators';
import authService from '@/services/authService';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const { control, handleSubmit, formState: { isSubmitting } } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      token: searchParams.get('token') || '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data) => {
    setError('');
    try {
      await authService.resetPassword(data);
      navigate('/auth/login', { state: { message: 'Password reset successfully' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to reset password.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <AuthFormHeader title="Reset password" subtitle="Enter your new password" />
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <FormTextField name="token" control={control} label="Reset token" />
      <PasswordField name="password" control={control} label="New password" />
      <PasswordField name="confirmPassword" control={control} label="Confirm password" />
      <Button type="submit" variant="contained" fullWidth size="large" disabled={isSubmitting}>
        Reset password
      </Button>
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Link component={RouterLink} to="/auth/login" variant="body2">
          Back to sign in
        </Link>
      </Box>
    </Box>
  );
};

export default ResetPasswordPage;
