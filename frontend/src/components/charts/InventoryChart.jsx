import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useTheme } from '@mui/material';

const InventoryChart = ({ data }) => {
  const theme = useTheme();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
        <XAxis type="number" />
        <YAxis dataKey="category" type="category" width={40} />
        <Tooltip />
        <Bar dataKey="stock" fill={theme.palette.warning.main} radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default InventoryChart;
