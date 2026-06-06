import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Card, CardContent, Button, Box } from '@mui/material';
import PageHeader from '@/components/common/PageHeader';
import FormTextField from '@/components/forms/FormTextField';
import FormSelect from '@/components/forms/FormSelect';
import { userFormSchema } from '@/utils/validators';
import { ROLES } from '@/utils/constants';
import { mockUsers } from '@/utils/mockDashboard';

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
  const user = useMemo(() => mockUsers.find((u) => String(u.id) === id), [id]);

  const { control, handleSubmit, formState: { isSubmitting } } = useForm({
    resolver: yupResolver(userFormSchema),
    values: user
      ? { firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, status: user.status }
      : undefined,
  });

  if (!user) {
    return <PageHeader title="User not found" />;
  }

  const onSubmit = () => navigate(`/users/${id}`);

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
