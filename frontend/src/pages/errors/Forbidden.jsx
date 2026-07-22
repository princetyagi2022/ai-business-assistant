import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Forbidden = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ textAlign: 'center', py: 12 }}>
      <Typography variant="h1" color="error" fontWeight={700}>
        403
      </Typography>
      <Typography variant="h5" gutterBottom>
        Access denied
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        You do not have permission to view this page.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/')}>
        Go Home
      </Button>
    </Box>
  );
};

export default Forbidden;
