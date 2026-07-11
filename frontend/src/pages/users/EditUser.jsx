import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Box, Button, Card, CardContent, CircularProgress } from '@mui/material';
import PageHeader from '@/components/common/PageHeader';
import FormTextField from '@/components/forms/FormTextField';
import FormSelect from '@/components/forms/FormSelect';
import { userFormSchema } from '@/utils/validators';
import { ROLES } from '@/utils/constants';
import userService from '@/services/userService';

const roleOptions = Object.entries(ROLES).map(([key, value]) => ({
  value,
  label: key.charAt(0) + key.slice(1).toLowerCase(),
}));

const statusOptions = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'INACTIVE', label: 'Inactive' },
];

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { control, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    resolver: yupResolver(userFormSchema),
    defaultValues: { firstName: '', lastName: '', email: '', role: ROLES.USER, status: 'ACTIVE' },
  });

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await userService.getById(id);
        setUser(data);
        reset({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          role: data.role,
          status: data.status,
        });
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load user.');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id, reset]);

  const onSubmit = async (values) => {
    await userService.update(id, values);
    navigate(`/users/${id}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 260 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !user) {
    return <Alert severity="error">{error || 'User not found'}</Alert>;
  }

  return (
    <>
      <PageHeader
        title="Edit User"
        breadcrumbs={[
          { label: 'Users', to: '/users' },
          { label: user.firstName, to: `/users/${id}` },
          { label: 'Edit' },
        ]}
      />
      <Card sx={{ maxWidth: 600 }}>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <FormTextField name="firstName" control={control} label="First name" />
            <FormTextField name="lastName" control={control} label="Last name" />
            <FormTextField name="email" control={control} label="Email" type="email" />
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
