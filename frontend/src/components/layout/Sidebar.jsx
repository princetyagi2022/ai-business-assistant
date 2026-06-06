import { NavLink } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  Typography,
} from '@mui/material';
import { navItems } from '@/routes/routeConfig';
import { APP_NAME } from '@/utils/constants';

const navLinkClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

const drawerContent = (
  <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
    <Toolbar sx={{ px: 2 }}>
      <Typography variant="h6" fontWeight={700} noWrap color="primary">
        {APP_NAME}
      </Typography>
    </Toolbar>
    <Divider />
    <List sx={{ flex: 1, px: 1, py: 1 }}>
      {navItems.map((item, index) => {
        if (item.divider) return <Divider key={`div-${index}`} sx={{ my: 1 }} />;
        const Icon = item.icon;
        return (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            className={navLinkClass}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              '&.active': {
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '& .MuiListItemIcon-root': { color: 'inherit' },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Icon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.9rem' }} />
          </ListItemButton>
        );
      })}
    </List>
  </Box>
);

const Sidebar = ({ drawerWidth, mobileOpen, onClose, isMobile }) => (
  <Box
    component="nav"
    sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    aria-label="navigation"
  >
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={isMobile ? mobileOpen : true}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      sx={{
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  </Box>
);

export default Sidebar;
