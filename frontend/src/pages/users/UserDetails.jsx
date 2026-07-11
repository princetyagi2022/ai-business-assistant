import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Box, Button, Card, CardContent, Chip, CircularProgress, Grid, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PageHeader from '@/components/common/PageHeader';
import { formatDate } from '@/utils/formatters';
import userService from '@/services/userService';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      setError(null);
      try {
        setUser(await userService.getById(id));
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load user.');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

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
