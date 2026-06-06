import { Grid } from '@mui/material';
import PageHeader from '@/components/common/PageHeader';
import AgentCard from './AgentCard';
import { mockAgents } from '@/utils/mockDashboard';

const AgentsDashboard = () => (
  <>
    <PageHeader
      title="AI Agents"
      subtitle="Autonomous agents for sales, support, fraud, inventory, and marketing"
    />
    <Grid container spacing={2}>
      {mockAgents.map((agent) => (
        <Grid item xs={12} sm={6} md={4} key={agent.id}>
          <AgentCard agent={agent} />
        </Grid>
      ))}
    </Grid>
  </>
);

export default AgentsDashboard;
