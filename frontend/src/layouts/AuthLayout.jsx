import { Outlet } from 'react-router-dom';
import { Box, Container, Paper, Typography, useTheme } from '@mui/material';
import { APP_NAME } from '@/utils/constants';

const AuthLayout = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main} 100%)`,
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={8} sx={{ p: { xs: 3, sm: 4 }, borderRadius: 3 }}>
          <Typography variant="h5" align="center" fontWeight={700} gutterBottom>
            {APP_NAME}
          </Typography>
          <Outlet />
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthLayout;
