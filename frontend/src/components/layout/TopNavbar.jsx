import {
  AppBar,
  Toolbar,
  IconButton,
  Box,
  Badge,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useNavigate } from 'react-router-dom';
import { useThemeMode } from '@/context/ThemeContext';
import UserMenu from './UserMenu';
import SearchBar from '@/components/common/SearchBar';

const TopNavbar = ({ drawerWidth, onMenuClick }) => {
  const { toggleTheme, isDark } = useThemeMode();
  const navigate = useNavigate();

  return (
    <AppBar
      position="fixed"
      color="inherit"
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
      }}
    >
      <Toolbar sx={{ gap: 1 }}>
        <IconButton edge="start" onClick={onMenuClick} sx={{ display: { md: 'none' } }}>
          <MenuIcon />
        </IconButton>
        <Box sx={{ flex: 1, maxWidth: 400, display: { xs: 'none', sm: 'block' } }}>
          <SearchBar placeholder="Search modules…" onChange={() => {}} value="" />
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton onClick={toggleTheme} color="inherit">
          {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <IconButton color="inherit" onClick={() => navigate('/notifications')}>
          <Badge badgeContent={3} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <UserMenu />
      </Toolbar>
    </AppBar>
  );
};

export default TopNavbar;
