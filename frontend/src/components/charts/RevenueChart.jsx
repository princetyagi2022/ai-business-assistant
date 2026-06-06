import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useTheme } from '@mui/material';

const RevenueChart = ({ data }) => {
  const theme = useTheme();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Area type="monotone" dataKey="revenue" stroke={theme.palette.primary.main} fill={theme.palette.primary.light} fillOpacity={0.4} name="Revenue" />
        <Area type="monotone" dataKey="profit" stroke={theme.palette.success.main} fill={theme.palette.success.light} fillOpacity={0.3} name="Profit" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default RevenueChart;
