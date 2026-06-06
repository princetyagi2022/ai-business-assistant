import { Typography, Box } from '@mui/material';

const AuthFormHeader = ({ title, subtitle }) => (
  <Box sx={{ mb: 3, textAlign: 'center' }}>
    <Typography variant="h5" fontWeight={600} gutterBottom>
      {title}
    </Typography>
    {subtitle && (
      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>
    )}
  </Box>
);

export default AuthFormHeader;
