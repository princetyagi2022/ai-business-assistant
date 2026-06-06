import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ErrorState = ({ title = 'Something went wrong', message, onRetry }) => (
  <Box sx={{ textAlign: 'center', py: 8 }}>
    <ErrorOutlineIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    {message && (
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {message}
      </Typography>
    )}
    {onRetry && (
      <Button variant="outlined" onClick={onRetry}>
        Try again
      </Button>
    )}
  </Box>
);

export default ErrorState;
