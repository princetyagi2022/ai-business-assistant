import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, Grid, Typography, Button, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PageHeader from '@/components/common/PageHeader';
import { mockUsers } from '@/utils/mockDashboard';
import { formatDate } from '@/utils/formatters';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useMemo(() => mockUsers.find((u) => String(u.id) === id), [id]);

  if (!user) {
    return <PageHeader title="User not found" />;
  }

  return (
    <>
      <PageHeader
        title={`${user.firstName} ${user.lastName}`}
        breadcrumbs={[{ label: 'Users', to: '/users' }, { label: user.firstName }]}
        actions={
          <Button variant="contained" startIcon={<EditIcon />} onClick={() => navigate(`/users/${id}/edit`)}>
            Edit
          </Button>
        }
      />
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">Email</Typography>
              <Typography>{user.email}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">Role</Typography>
              <Typography><Chip label={user.role} size="small" /></Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">Status</Typography>
              <Typography><Chip label={user.status} size="small" color="success" /></Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">Created</Typography>
              <Typography>{formatDate(user.createdAt)}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default UserDetails;
