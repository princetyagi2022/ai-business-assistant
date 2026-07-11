import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import customerService from '@/services/customerService';

const columns = [
  { id: 'name', label: 'Lead' },
  { id: 'company', label: 'Company' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
  {
    id: 'distanceMeters',
    label: 'Distance',
    render: (row) => {
      const meters = Number(row.distanceMeters || 0);
      const label = meters < 1000 ? `${meters} m` : `${Number(row.distanceKm).toFixed(1)} km`;
      return <Chip label={label} size="small" color="primary" variant="outlined" />;
    },
  },
  {
    id: 'status',
    label: 'Status',
    render: (row) => (
      <Chip label={row.status} size="small" color={row.status === 'ACTIVE' ? 'success' : 'default'} />
    ),
  },
];

const LeadSearchPage = () => {
  const [search, setSearch] = useState('');
  const [distance, setDistance] = useState('500m');
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await customerService.getAll({
        search: search || undefined,
        distance: distance || undefined,
        limit: 50,
      });
      setLeads(Array.isArray(data) ? data : data?.items || []);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to search leads.');
    } finally {
      setLoading(false);
    }
  }, [distance, search]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const resetSearch = () => {
    setSearch('');
    setDistance('500m');
  };

  return (
    <>
      <PageHeader title="Lead Search" subtitle="Find nearby leads by meters or kilometers" />

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={1.5}
        sx={{ mb: 2 }}
        component="form"
        onSubmit={(event) => {
          event.preventDefault();
          loadLeads();
        }}
      >
        <TextField
          size="small"
          label="Search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Name, company, email"
          sx={{ flex: '1 1 280px' }}
        />
        <TextField
          size="small"
          label="Distance"
          value={distance}
          onChange={(event) => setDistance(event.target.value)}
          placeholder="500m, 1km, 2 km, 5k"
          sx={{ width: { xs: '100%', md: 220 } }}
        />
        <Button type="submit" variant="contained" startIcon={<SearchIcon />} disabled={loading}>
          Search
        </Button>
        <Button variant="text" startIcon={<RestartAltIcon />} onClick={resetSearch}>
          Reset
        </Button>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Examples: 500m, 500 meter, 1km, 2 km, 5k.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 260 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DataTable columns={columns} rows={leads} emptyMessage="No leads found for this distance" />
      )}
    </>
  );
};

export default LeadSearchPage;
