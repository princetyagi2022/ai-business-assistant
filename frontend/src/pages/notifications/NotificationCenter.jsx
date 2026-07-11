import { useEffect, useState } from 'react';
import { Alert, Box, Button, Card, Chip, CircularProgress, IconButton, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckIcon from '@mui/icons-material/Check';
import PageHeader from '@/components/common/PageHeader';
import notificationService from '@/services/notificationService';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await notificationService.getAll();
        setNotifications(Array.isArray(data) ? data : data?.items || []);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load notifications.');
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const markAllRead = async () => {
    await notificationService.markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = async (id) => {
    await notificationService.markRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <>
      <PageHeader
        title="Notifications"
        subtitle={`${unread} unread notifications from backend data`}
        actions={
          <Button variant="outlined" onClick={markAllRead} disabled={unread === 0}>
            Mark all read
          </Button>
        }
      />
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 260 }}>
          <CircularProgress />
        </Box>
      ) : (
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
                  secondary={`${n.message} - ${n.time}`}
                />
              </ListItem>
            ))}
          </List>
        </Card>
      )}
    </>
  );
};

export default NotificationCenter;
