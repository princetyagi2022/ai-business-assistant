import { Box, CircularProgress, Typography } from '@mui/material';

const Loader = ({ fullScreen = false, message = 'Loading…', size = 40 }) => {
  const content = (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <CircularProgress size={size} />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        {content}
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
      {content}
    </Box>
  );
};

export default Loader;
