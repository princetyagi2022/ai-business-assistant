import { Box, Typography, Button } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

const EmptyState = ({ title = 'No data', description, actionLabel, onAction, icon: Icon = InboxIcon }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 8,
      px: 2,
      textAlign: 'center',
    }}
  >
    <Icon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    {description && (
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 400 }}>
        {description}
      </Typography>
    )}
    {actionLabel && onAction && (
      <Button variant="contained" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </Box>
);

export default EmptyState;
