import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Card, CardContent, Button, Alert, Box } from '@mui/material';
import PageHeader from '@/components/common/PageHeader';
import FormTextField from '@/components/forms/FormTextField';
import FormSelect from '@/components/forms/FormSelect';
import PasswordField from '@/components/forms/PasswordField';
import { userFormSchema } from '@/utils/validators';
import { ROLES } from '@/utils/constants';
import { useAuth } from '@/context/AuthContext';
import userService from '@/services/userService';

const allRoleOptions = [
  { value: ROLES.ADMIN, label: 'Admin' },
  { value: ROLES.MANAGER, label: 'Manager' },
  { value: ROLES.EMPLOYEE, label: 'Employee' },
];

const statusOptions = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
];

const CreateUser = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // A manager may only create employee accounts; admin can create any staff role.
  const roleOptions = hasRole(ROLES.ADMIN)
    ? allRoleOptions
    : allRoleOptions.filter((option) => option.value === ROLES.EMPLOYEE);

  const { control, handleSubmit, formState: { isSubmitting } } = useForm({
    resolver: yupResolver(userFormSchema),
    defaultValues: { firstName: '', lastName: '', email: '', phone: '', password: '', role: ROLES.EMPLOYEE, status: 'ACTIVE' },
  });

  const onSubmit = async (values) => {
    setError('');
    try {
      await userService.create(values);
      setSuccess(true);
      setTimeout(() => navigate('/users'), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user.');
    }
  };

  return (
    <>
      <PageHeader
        title="Create User"
        breadcrumbs={[{ label: 'Users', to: '/users' }, { label: 'Create' }]}
      />
      <Card sx={{ maxWidth: 600 }}>
        <CardContent>
          {success && <Alert severity="success" sx={{ mb: 2 }}>User created successfully</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <FormTextField name="firstName" control={control} label="First name" />
            <FormTextField name="lastName" control={control} label="Last name" />
            <FormTextField name="email" control={control} label="Email" type="email" />
            <FormTextField name="phone" control={control} label="Phone" />
            <PasswordField name="password" control={control} label="Password (leave blank for default)" />
            <FormSelect name="role" control={control} label="Role" options={roleOptions} />
            <FormSelect name="status" control={control} label="Status" options={statusOptions} />
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                Create
              </Button>
              <Button variant="outlined" onClick={() => navigate('/users')}>
                Cancel
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default CreateUser;

