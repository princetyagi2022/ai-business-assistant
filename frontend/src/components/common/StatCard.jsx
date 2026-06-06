import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { formatCurrency, formatNumber, formatPercent } from '@/utils/formatters';

const formatValue = (value, format) => {
  if (format === 'currency') return formatCurrency(value);
  if (format === 'percent') return `${value}%`;
  return formatNumber(value);
};

const StatCard = ({ label, value, change, format = 'number', color = 'primary', icon: Icon }) => {
  const isPositive = change >= 0;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {label}
          </Typography>
          {Icon && <Icon color={color} />}
        </Box>
        <Typography variant="h4" fontWeight={700} sx={{ my: 1 }}>
          {formatValue(value, format)}
        </Typography>
        {change !== undefined && (
          <Chip
            size="small"
            icon={isPositive ? <TrendingUpIcon /> : <TrendingDownIcon />}
            label={formatPercent(change)}
            color={isPositive ? 'success' : 'error'}
            variant="outlined"
          />
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
