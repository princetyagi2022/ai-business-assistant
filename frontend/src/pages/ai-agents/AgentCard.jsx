import { Card, CardContent, CardActions, Typography, Chip, Button, Box } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { useNavigate } from 'react-router-dom';

const AgentCard = ({ agent }) => {
  const navigate = useNavigate();
  const isActive = agent.status === 'active';

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <SmartToyIcon color="primary" />
          <Chip label={agent.status} size="small" color={isActive ? 'success' : 'default'} />
        </Box>
        <Typography variant="h6" gutterBottom>
          {agent.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {agent.description}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {agent.tasksCompleted} tasks completed
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => navigate('/chatbot')}>
          Interact
        </Button>
      </CardActions>
    </Card>
  );
};

export default AgentCard;
