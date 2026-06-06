import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useTheme } from '@mui/material';

const OrdersTrendChart = ({ data }) => {
  const theme = useTheme();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="orders" fill={theme.palette.info.main} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default OrdersTrendChart;
