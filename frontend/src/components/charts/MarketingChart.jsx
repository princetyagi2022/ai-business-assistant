import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useTheme } from '@mui/material';

const MarketingChart = ({ data }) => {
  const theme = useTheme();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
        <XAxis dataKey="channel" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="clicks" fill={theme.palette.primary.main} />
        <Bar dataKey="conversions" fill={theme.palette.success.main} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default MarketingChart;
