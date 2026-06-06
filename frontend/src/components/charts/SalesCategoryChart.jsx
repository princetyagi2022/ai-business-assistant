import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useTheme } from '@mui/material';

const COLORS = ['#1565C0', '#7B1FA2', '#2E7D32', '#ED6C02', '#0288D1'];

const SalesCategoryChart = ({ data }) => {
  const theme = useTheme();
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ background: theme.palette.background.paper }} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default SalesCategoryChart;
