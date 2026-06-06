import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Alert, Link, Box, Grid } from '@mui/material';
import AuthFormHeader from '@/components/auth/AuthFormHeader';
import FormTextField from '@/components/forms/FormTextField';
import PasswordField from '@/components/forms/PasswordField';
import { registerSchema } from '@/utils/validators';
import { useAuth } from '@/context/AuthContext';

const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState('');
  const [success, setSuccess] = useState(false);

  const { control, handleSubmit, formState: { isSubmitting } } = useForm({
    resolver: yupResolver(registerSchema),
    defaultValues: { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data) => {
    setSubmitError('');
    const result = await registerUser(data);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => navigate('/auth/verify-email', { state: { email: data.email } }), 1500);
    } else setSubmitError(result.error);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <AuthFormHeader title="Create account" subtitle="Get started with AI Business Assistant" />
      {success && <Alert severity="success" sx={{ mb: 2 }}>Account created! Verify your email.</Alert>}
      {submitError && <Alert severity="error" sx={{ mb: 2 }}>{submitError}</Alert>}
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <FormTextField name="firstName" control={control} label="First name" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormTextField name="lastName" control={control} label="Last name" />
        </Grid>
      </Grid>
      <FormTextField name="email" control={control} label="Email" type="email" />
      <PasswordField name="password" control={control} label="Password" />
      <PasswordField name="confirmPassword" control={control} label="Confirm password" />
      <Button type="submit" variant="contained" fullWidth size="large" disabled={isSubmitting} sx={{ mt: 1 }}>
        Register
      </Button>
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Link component={RouterLink} to="/auth/login" variant="body2">
          Already have an account? Sign in
        </Link>
      </Box>
    </Box>
  );
};

export default RegisterPage;
