import { Grid, Skeleton, Card, CardContent } from '@mui/material';

const PageSkeleton = ({ cards = 4 }) => (
  <Grid container spacing={2}>
    {Array.from({ length: cards }).map((_, i) => (
      <Grid item xs={12} sm={6} md={3} key={i}>
        <Card>
          <CardContent>
            <Skeleton height={24} width="60%" />
            <Skeleton height={40} sx={{ my: 1 }} />
            <Skeleton height={20} width="40%" />
          </CardContent>
        </Card>
      </Grid>
    ))}
    <Grid item xs={12}>
      <Skeleton variant="rounded" height={320} />
    </Grid>
  </Grid>
);

export default PageSkeleton;
