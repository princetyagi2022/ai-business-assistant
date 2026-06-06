import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ServerError = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ textAlign: 'center', py: 12 }}>
      <Typography variant="h1" color="warning.main" fontWeight={700}>
        500
      </Typography>
      <Typography variant="h5" gutterBottom>
        Server error
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Something went wrong on our end. Please try again later.
      </Typography>
      <Button variant="contained" onClick={() => navigate(-1)}>
        Go back
      </Button>
    </Box>
  );
};

export default ServerError;
