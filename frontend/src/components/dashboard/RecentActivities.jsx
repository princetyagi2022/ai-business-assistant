import { Card, CardHeader, CardContent, List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import InventoryIcon from '@mui/icons-material/Inventory';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { formatRelativeTime } from '@/utils/formatters';

const iconMap = {
  order: ShoppingCartIcon,
  user: PersonIcon,
  inventory: InventoryIcon,
  sale: ShoppingCartIcon,
  agent: SmartToyIcon,
};

const RecentActivities = ({ activities = [] }) => (
  <Card sx={{ height: '100%' }}>
    <CardHeader title="Recent Activity" subheader="Latest business events" />
    <CardContent sx={{ pt: 0 }}>
      <List dense>
        {activities.map((item) => {
          const Icon = iconMap[item.type] || PersonIcon;
          return (
            <ListItem key={item.id} alignItems="flex-start">
              <ListItemAvatar>
                <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.light' }}>
                  <Icon fontSize="small" />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={item.message}
                secondary={
                  <>
                    <Typography component="span" variant="caption" color="text.secondary">
                      {item.user} · {formatRelativeTime(item.time)}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          );
        })}
      </List>
    </CardContent>
  </Card>
);

export default RecentActivities;
