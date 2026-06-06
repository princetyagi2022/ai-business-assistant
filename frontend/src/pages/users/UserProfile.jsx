import { Card, CardContent, Grid, Typography, Avatar, Box } from '@mui/material';
import PageHeader from '@/components/common/PageHeader';
import { useAuth } from '@/context/AuthContext';
import { getInitials } from '@/utils/formatters';

const UserProfile = () => {
  const { user } = useAuth();

  return (
    <>
      <PageHeader title="My Profile" subtitle="Your account information" />
      <Card sx={{ maxWidth: 640 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Avatar sx={{ width: 72, height: 72, bgcolor: 'primary.main', fontSize: '1.5rem' }}>
              {getInitials(user?.firstName, user?.lastName)}
            </Avatar>
            <Box>
              <Typography variant="h5">
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography color="text.secondary">{user?.email}</Typography>
            </Box>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">Role</Typography>
              <Typography>{user?.role?.replace('ROLE_', '') || '—'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" color="text.secondary">Username</Typography>
              <Typography>{user?.username || '—'}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default UserProfile;
