import { Card, CardHeader, CardContent, Grid, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import AssessmentIcon from '@mui/icons-material/Assessment';
import ChatIcon from '@mui/icons-material/Chat';
import { useNavigate } from 'react-router-dom';

const actions = [
  { label: 'New User', icon: AddIcon, path: '/users/create' },
  { label: 'AI Agents', icon: SmartToyIcon, path: '/ai-agents' },
  { label: 'Reports', icon: AssessmentIcon, path: '/reports' },
  { label: 'Chatbot', icon: ChatIcon, path: '/chatbot' },
];

const QuickActions = () => {
  const navigate = useNavigate();
  return (
    <Card>
      <CardHeader title="Quick Actions" />
      <CardContent>
        <Grid container spacing={1}>
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Grid item xs={6} key={action.path}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<Icon />}
                  onClick={() => navigate(action.path)}
                  sx={{ py: 1.5 }}
                >
                  {action.label}
                </Button>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
