import { Card, CardHeader, CardContent, Stack, Alert } from '@mui/material';

const AIInsights = ({ insights = [] }) => (
  <Card sx={{ height: '100%' }}>
    <CardHeader title="AI Insights" subheader="Powered by business intelligence" />
    <CardContent>
      <Stack spacing={1.5}>
        {insights.map((insight) => (
          <Alert key={insight.id} severity={insight.severity}>
            <strong>{insight.title}</strong> — {insight.description}
          </Alert>
        ))}
      </Stack>
    </CardContent>
  </Card>
);

export default AIInsights;
