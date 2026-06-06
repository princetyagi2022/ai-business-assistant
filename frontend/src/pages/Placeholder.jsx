import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import ConstructionIcon from '@mui/icons-material/Construction';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/common/PageHeader';

const Placeholder = ({ title = 'Coming Soon', description = 'This module is under development.' }) => {
  const navigate = useNavigate();

  return (
    <>
      <PageHeader title={title} subtitle={description} />
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <ConstructionIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 480, mx: 'auto' }}>
            {description}
          </Typography>
          <Box>
            <Button variant="contained" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default Placeholder;
