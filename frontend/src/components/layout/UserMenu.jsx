import { useState } from 'react';
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Typography,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getInitials } from '@/utils/formatters';

const UserMenu = () => {
  const [anchor, setAnchor] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
    setAnchor(null);
  };

  return (
    <>
      <IconButton onClick={(e) => setAnchor(e.currentTarget)} sx={{ ml: 1 }}>
        <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main', fontSize: '0.875rem' }}>
          {getInitials(user?.firstName, user?.lastName)}
        </Avatar>
      </IconButton>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        <MenuItem disabled>
          <Typography variant="body2" fontWeight={600}>
            {user?.firstName} {user?.lastName}
          </Typography>
        </MenuItem>
        <Typography variant="caption" sx={{ px: 2, pb: 1, display: 'block' }} color="text.secondary">
          {user?.email}
        </Typography>
        <Divider />
        <MenuItem onClick={() => { navigate('/profile'); setAnchor(null); }}>
          <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => { navigate('/settings'); setAnchor(null); }}>
          <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
