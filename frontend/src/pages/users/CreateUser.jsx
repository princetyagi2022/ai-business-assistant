import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Card, CardContent, Button, Alert, Box } from '@mui/material';
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

const CreateUser = () => {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const { control, handleSubmit, formState: { isSubmitting } } = useForm({
    resolver: yupResolver(userFormSchema),
    defaultValues: { firstName: '', lastName: '', email: '', role: ROLES.USER, status: 'ACTIVE' },
  });

  const onSubmit = async (values) => {
    await userService.create(values);
    setSuccess(true);
    setTimeout(() => navigate('/users'), 1000);
  };

  return (
    <>
      <PageHeader
        title="Create User"
        breadcrumbs={[{ label: 'Users', to: '/users' }, { label: 'Create' }]}
      />
      <Card sx={{ maxWidth: 600 }}>
        <CardContent>
          {success && <Alert severity="success" sx={{ mb: 2 }}>User created</Alert>}
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <FormTextField name="firstName" control={control} label="First name" />
            <FormTextField name="lastName" control={control} label="Last name" />
            <FormTextField name="email" control={control} label="Email" type="email" />
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
