import { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Alert, Link, Box, Typography } from '@mui/material';
import AuthFormHeader from '@/components/auth/AuthFormHeader';
import FormTextField from '@/components/forms/FormTextField';
import PasswordField from '@/components/forms/PasswordField';
import { loginSchema } from '@/utils/validators';
import { useAuth } from '@/context/AuthContext';
import { DEMO_CREDENTIALS, DEMO_MODE, ROLES } from '@/utils/constants';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitError, setSubmitError] = useState('');
  const from = location.state?.from?.pathname;

  const { control, handleSubmit, formState: { isSubmitting } } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: DEMO_MODE ? DEMO_CREDENTIALS.email : '', password: '' },
  });

  const onSubmit = async (data) => {
    setSubmitError('');
    const result = await login(data);
    if (result.success) {
      // Normal shoppers never see the business dashboard; send them to the storefront.
      const landing = result.role === ROLES.USER ? '/shop' : (from || '/dashboard');
      navigate(landing, { replace: true });
    } else {
      setSubmitError(result.error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <AuthFormHeader title="Sign in" subtitle="Welcome back to your business dashboard" />
      {submitError && <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>}
      {DEMO_MODE && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Demo: {DEMO_CREDENTIALS.email} / any password (8+ chars)
        </Alert>
      )}
      <FormTextField name="email" control={control} label="Email" type="email" autoComplete="email" />
      <PasswordField name="password" control={control} autoComplete="current-password" />
      <Box sx={{ textAlign: 'right', mb: 2 }}>
        <Link component={RouterLink} to="/auth/forgot-password" variant="body2">
          Forgot password?
        </Link>
      </Box>
      <Button type="submit" variant="contained" fullWidth size="large" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </Button>
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2">
          No account? <Link component={RouterLink} to="/auth/register">Register</Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;
