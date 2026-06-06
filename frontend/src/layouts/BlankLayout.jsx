import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

const BlankLayout = () => (
  <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
    <Outlet />
  </Box>
);

export default BlankLayout;
