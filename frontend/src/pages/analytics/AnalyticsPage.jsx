import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  MenuItem,
  Select,
  Stack,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from '@mui/material';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import DataObjectIcon from '@mui/icons-material/DataObject';
import ScienceIcon from '@mui/icons-material/Science';
import TableViewIcon from '@mui/icons-material/TableView';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import ChartCard from '@/components/common/ChartCard';
import DataTable from '@/components/common/DataTable';
import PageHeader from '@/components/common/PageHeader';
import StatCard from '@/components/common/StatCard';
import TablePagination from '@/components/common/Pagination';
import TableToolbar from '@/components/common/TableToolbar';
import { useTableControls } from '@/hooks/useTableControls';
import mlAnalyticsService from '@/services/mlAnalyticsService';
import { inferFilterConfigs } from '@/utils/tableFilters';

const formatLabel = (value) => value
  .replace(/_/g, ' ')
  .replace(/\b\w/g, (letter) => letter.toUpperCase());

const normalizeRows = (rows = []) => rows.map((row, index) => ({
  id: row.id ?? row.order_id ?? row.transaction_id ?? row.sku ?? row.email ?? `${index + 1}`,
  ...row,
}));

const buildColumns = (columns = [], rows = []) => {
  const keys = columns.length ? columns : Object.keys(rows[0] || {}).filter((key) => key !== 'id');
  return keys.slice(0, 8).map((key) => ({
    id: key,
    label: formatLabel(key),
    render: (row) => {
      const value = row[key];
      if (typeof value === 'number') return Number.isInteger(value) ? value : value.toFixed(2);
      if (typeof value === 'boolean') return value ? 'Yes' : 'No';
      return value ?? '-';
    },
  }));
};

const flattenSummary = (summary = {}) => Object.entries(summary).flatMap(([key, value]) => {
  if (Array.isArray(value)) {
    return [{ key, label: formatLabel(key), value: value.length }];
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).map(([childKey, childValue]) => ({
      key: `${key}_${childKey}`,
      label: formatLabel(childKey),
      value: childValue,
    }));
  }
  return [{ key, label: formatLabel(key), value }];
});

const GenericAnalysisChart = ({ data = [] }) => {
  const theme = useTheme();
  const rows = data.slice(0, 12);
  const firstRow = rows[0] || {};
  const keys = Object.keys(firstRow);
  const numericKeys = keys.filter((key) => typeof firstRow[key] === 'number');
  const labelKey = keys.find((key) => !numericKeys.includes(key)) || keys[0];
  const usesLine = /month|date|period/i.test(labelKey);

  if (!rows.length || !numericKeys.length) {
    return (
      <Box sx={{ height: '100%', display: 'grid', placeItems: 'center' }}>
        <Typography color="text.secondary">No chart data returned for this operation.</Typography>
      </Box>
    );
  }

  const Chart = usesLine ? LineChart : BarChart;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <Chart data={rows}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
        <XAxis dataKey={labelKey} tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        {numericKeys.map((key, index) => (
          usesLine ? (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={index === 0 ? theme.palette.primary.main : theme.palette.success.main}
              strokeWidth={2}
              name={formatLabel(key)}
            />
          ) : (
            <Bar
              key={key}
              dataKey={key}
              fill={index === 0 ? theme.palette.primary.main : theme.palette.success.main}
              name={formatLabel(key)}
            />
          )
        ))}
      </Chart>
    </ResponsiveContainer>
  );
};

const AnalyticsPage = () => {
  const [catalog, setCatalog] = useState([]);
  const [selectedModule, setSelectedModule] = useState('sales');
  const [selectedOperation, setSelectedOperation] = useState('');
  const [dataset, setDataset] = useState(null);
  const [tableTab, setTableTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCatalog = async () => {
      try {
        const response = await mlAnalyticsService.getCatalog();
        const datasets = response.datasets || [];
        setCatalog(datasets);
        if (datasets.length) {
          setSelectedModule(datasets[0].module);
          setSelectedOperation(datasets[0].default_operation);
        }
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to connect to the ML dataset API.');
        setLoading(false);
      }
    };

    loadCatalog();
  }, []);

  useEffect(() => {
    if (!selectedModule) return;

    const loadDataset = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = selectedOperation
          ? await mlAnalyticsService.runOperation(selectedModule, selectedOperation)
          : await mlAnalyticsService.getDataset(selectedModule);
        setDataset(response);
        setSelectedOperation(response.selected_operation);
        setTableTab('all');
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load ML analysis data.');
      } finally {
        setLoading(false);
      }
    };

    loadDataset();
  }, [selectedModule, selectedOperation]);

  const currentCatalogItem = useMemo(
    () => catalog.find((item) => item.module === selectedModule),
    [catalog, selectedModule],
  );

  const summaryStats = useMemo(
    () => flattenSummary(dataset?.analysis?.summary)
      .filter((stat) => typeof stat.value === 'number')
      .slice(0, 4),
    [dataset],
  );

  const dataRows = useMemo(() => normalizeRows(dataset?.data?.[tableTab] || []), [dataset, tableTab]);
  const analysisRows = useMemo(() => normalizeRows(dataset?.analysis?.rows || []), [dataset]);
  const dataColumns = useMemo(() => buildColumns(dataset?.columns, dataRows), [dataRows, dataset?.columns]);
  const analysisColumns = useMemo(() => buildColumns([], analysisRows), [analysisRows]);
  const dataSearchKeys = useMemo(() => dataColumns.map((column) => column.id), [dataColumns]);
  const analysisSearchKeys = useMemo(() => analysisColumns.map((column) => column.id), [analysisColumns]);
  const dataFilterConfigs = useMemo(() => inferFilterConfigs(dataRows, dataSearchKeys), [dataRows, dataSearchKeys]);
  const analysisFilterConfigs = useMemo(
    () => inferFilterConfigs(analysisRows, analysisSearchKeys),
    [analysisRows, analysisSearchKeys],
  );
  const dataTable = useTableControls({
    rows: dataRows,
    searchKeys: dataSearchKeys,
    filterConfigs: dataFilterConfigs,
  });
  const analysisTable = useTableControls({
    rows: analysisRows,
    searchKeys: analysisSearchKeys,
    filterConfigs: analysisFilterConfigs,
  });
  const chartData = dataset?.analysis?.chart_data || dataset?.analysis?.rows || [];

  const handleModuleChange = (event) => {
    const module = event.target.value;
    const nextCatalogItem = catalog.find((item) => item.module === module);
    setSelectedModule(module);
    setSelectedOperation(nextCatalogItem?.default_operation || '');
  };

  return (
    <>
      <PageHeader
        title="Analytics"
        subtitle="Real ML datasets, train/test split, model operations, and visual analysis"
        actions={(
          <Select
            size="small"
            value={selectedModule}
            onChange={handleModuleChange}
            sx={{ minWidth: 180 }}
          >
            {catalog.map((item) => (
              <MenuItem key={item.module} value={item.module}>{item.label}</MenuItem>
            ))}
          </Select>
        )}
      />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading && !dataset ? (
        <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 300 }}>
          <CircularProgress />
        </Box>
      ) : dataset && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <StatCard
              label="Total Rows"
              value={dataset.split.total_count}
              icon={DataObjectIcon}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              label="Train Rows"
              value={dataset.split.train_count}
              icon={ScienceIcon}
              color="success"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              label="Test Rows"
              value={dataset.split.test_count}
              icon={TableViewIcon}
              color="warning"
            />
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between">
                  <Box>
                    <Typography variant="h6">{dataset.label} ML Operation</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Source: {dataset.source_file} | Active operation: {formatLabel(dataset.selected_operation)}
                    </Typography>
                  </Box>
                  <ButtonGroup size="small" variant="outlined">
                    {(currentCatalogItem?.operations || dataset.operations).map((operation) => (
                      <Button
                        key={operation}
                        variant={operation === selectedOperation ? 'contained' : 'outlined'}
                        onClick={() => setSelectedOperation(operation)}
                      >
                        {formatLabel(operation)}
                      </Button>
                    ))}
                  </ButtonGroup>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {summaryStats.map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat.key}>
              <StatCard
                label={stat.label}
                value={stat.value}
                icon={AnalyticsIcon}
                color="info"
              />
            </Grid>
          ))}

          <Grid item xs={12} lg={7}>
            <ChartCard title="Graphical Analysis" subheader={formatLabel(dataset.selected_operation)} height={340}>
              <GenericAnalysisChart data={chartData} />
            </ChartCard>
          </Grid>

          <Grid item xs={12} lg={5}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>Operation Result Rows</Typography>
                <TableToolbar
                  search={analysisTable.search}
                  onSearchChange={analysisTable.setSearch}
                  searchPlaceholder="Search result rows..."
                  filters={analysisTable.filters}
                  filterOptions={analysisTable.filterOptions}
                  onFilterChange={analysisTable.setFilter}
                  onReset={analysisTable.resetFilters}
                />
                <DataTable
                  columns={analysisColumns}
                  rows={analysisTable.paginatedRows}
                  emptyMessage="No operation rows returned"
                />
                <TablePagination
                  page={analysisTable.pagination.page}
                  size={analysisTable.pagination.size}
                  totalPages={analysisTable.pagination.totalPages}
                  totalItems={analysisTable.filteredRows.length}
                  onPageChange={analysisTable.pagination.setPage}
                  onSizeChange={analysisTable.pagination.setSize}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" sx={{ mb: 2 }}>
                  <Box>
                    <Typography variant="h6">Dataset Rows</Typography>
                    <Typography variant="body2" color="text.secondary">
                      All records plus deterministic 80/20 train and test split from the ML CSV data.
                    </Typography>
                  </Box>
                  <Tabs value={tableTab} onChange={(_, value) => setTableTab(value)}>
                    <Tab value="all" label={`All (${dataset.split.total_count})`} />
                    <Tab value="train" label={`Train (${dataset.split.train_count})`} />
                    <Tab value="test" label={`Test (${dataset.split.test_count})`} />
                  </Tabs>
                </Stack>
                <TableToolbar
                  search={dataTable.search}
                  onSearchChange={dataTable.setSearch}
                  searchPlaceholder="Search dataset rows..."
                  filters={dataTable.filters}
                  filterOptions={dataTable.filterOptions}
                  onFilterChange={dataTable.setFilter}
                  onReset={dataTable.resetFilters}
                />
                <DataTable
                  columns={dataColumns}
                  rows={dataTable.paginatedRows}
                  emptyMessage="No dataset rows found"
                />
                <TablePagination
                  page={dataTable.pagination.page}
                  size={dataTable.pagination.size}
                  totalPages={dataTable.pagination.totalPages}
                  totalItems={dataTable.filteredRows.length}
                  onPageChange={dataTable.pagination.setPage}
                  onSizeChange={dataTable.pagination.setSize}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default AnalyticsPage;
