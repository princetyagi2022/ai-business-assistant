import { useEffect, useState } from 'react';
import { Alert, Box, CircularProgress, Grid } from '@mui/material';
import PageHeader from '@/components/common/PageHeader';
import AgentCard from './AgentCard';
import api, { unwrap } from '@/services/api';

const AgentsDashboard = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAgents = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get('/agents').then(unwrap);
        setAgents(Array.isArray(data) ? data : data?.items || []);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load AI agents.');
      } finally {
        setLoading(false);
      }
    };

    loadAgents();
  }, []);

  return (
    <>
      <PageHeader
        title="AI Agents"
        subtitle="Autonomous agents connected to sales, support, fraud, inventory, and marketing data"
      />
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 260 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={2}>
          {agents.map((agent) => (
            <Grid item xs={12} sm={6} md={4} key={agent.id}>
              <AgentCard agent={agent} />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default AgentsDashboard;
