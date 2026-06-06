import { useState } from 'react';
import { Card, List, ListItem, ListItemText, ListItemIcon, IconButton, Chip, Box, Button } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckIcon from '@mui/icons-material/Check';
import PageHeader from '@/components/common/PageHeader';

const initialNotifications = [
  { id: 1, title: 'Low inventory alert', message: 'Wireless Headphones below safety stock.', read: false, time: '10 min ago' },
  { id: 2, title: 'New order received', message: 'Order #ORD-2841 from Acme Corp.', read: false, time: '1 hour ago' },
  { id: 3, title: 'AI report ready', message: 'Monthly sales report is available.', read: true, time: 'Yesterday' },
];

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <>
      <PageHeader
        title="Notifications"
        subtitle={`${unread} unread notifications`}
        actions={
          <Button variant="outlined" onClick={markAllRead} disabled={unread === 0}>
            Mark all read
          </Button>
        }
      />
      <Card>
        <List>
          {notifications.map((n) => (
            <ListItem
              key={n.id}
              secondaryAction={
                !n.read && (
                  <IconButton edge="end" onClick={() => markRead(n.id)}>
                    <CheckIcon />
                  </IconButton>
                )
              }
              sx={{ bgcolor: n.read ? 'transparent' : 'action.hover' }}
            >
              <ListItemIcon>
                <NotificationsIcon color={n.read ? 'disabled' : 'primary'} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {n.title}
                    {!n.read && <Chip label="New" size="small" color="primary" />}
                  </Box>
                }
                secondary={`${n.message} · ${n.time}`}
              />
            </ListItem>
          ))}
        </List>
      </Card>
    </>
  );
};

export default NotificationCenter;
