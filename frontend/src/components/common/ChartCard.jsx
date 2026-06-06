import { Card, CardContent, CardHeader, Box } from '@mui/material';

const ChartCard = ({ title, subheader, action, children, height = 280 }) => (
  <Card sx={{ height: '100%' }}>
    <CardHeader title={title} subheader={subheader} action={action} />
    <CardContent>
      <Box sx={{ width: '100%', height }}>{children}</Box>
    </CardContent>
  </Card>
);

export default ChartCard;
