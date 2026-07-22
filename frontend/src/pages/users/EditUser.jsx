import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Box, Button, Card, CardContent, CircularProgress } from '@mui/material';
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

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // A manager may only manage employee accounts; admin can manage any staff role.
  const roleOptions = hasRole(ROLES.ADMIN)
    ? allRoleOptions
    : allRoleOptions.filter((option) => option.value === ROLES.EMPLOYEE);

  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    resolver: yupResolver(userFormSchema),
    defaultValues: { firstName: '', lastName: '', email: '', phone: '', password: '', role: ROLES.EMPLOYEE, status: 'ACTIVE' },
  });

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await userService.getById(id);
        setUser(data);
        reset({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || '',
          password: '',
          role: data.role || ROLES.EMPLOYEE,
          status: data.status || 'ACTIVE',
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load user.');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id, reset]);

  const onSubmit = async (values) => {
    setError(null);
    try {
      await userService.update(id, values);
      navigate(`/users/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user.');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 260 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !user) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <>
      <PageHeader
        title="Edit User"
        breadcrumbs={[
          { label: 'Users', to: '/users' },
          { label: user?.firstName || '', to: `/users/${id}` },
          { label: 'Edit' },
        ]}
      />
      <Card sx={{ maxWidth: 600 }}>
        <CardContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <FormTextField name="firstName" control={control} label="First name" />
            <FormTextField name="lastName" control={control} label="Last name" />
            <FormTextField name="email" control={control} label="Email" type="email" />
            <FormTextField name="phone" control={control} label="Phone" />
            <PasswordField name="password" control={control} label="New password (leave blank to keep current)" />
            <FormSelect name="role" control={control} label="Role" options={roleOptions} />
            <FormSelect name="status" control={control} label="Status" options={statusOptions} />
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                Save
              </Button>
              <Button variant="outlined" onClick={() => navigate(`/users/${id}`)}>
                Cancel
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default EditUser;

