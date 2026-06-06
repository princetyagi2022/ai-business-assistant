import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const PageHeader = ({ title, subtitle, breadcrumbs = [], actions }) => (
  <Box sx={{ mb: 3 }}>
    {breadcrumbs.length > 0 && (
      <Breadcrumbs sx={{ mb: 1 }}>
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          if (isLast || !crumb.to) {
            return (
              <Typography key={crumb.label} color="text.primary" variant="body2">
                {crumb.label}
              </Typography>
            );
          }
          return (
            <Link key={crumb.label} component={RouterLink} to={crumb.to} underline="hover" variant="body2">
              {crumb.label}
            </Link>
          );
        })}
      </Breadcrumbs>
    )}
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
      <Box>
        <Typography variant="h4" fontWeight={700}>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {actions && <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>{actions}</Box>}
    </Box>
  </Box>
);

export default PageHeader;
