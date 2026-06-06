import { Box, IconButton, Typography, Select, MenuItem, FormControl } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { PAGINATION_DEFAULTS } from '@/utils/constants';

const Pagination = ({
  page,
  totalPages,
  size,
  totalItems,
  onPageChange,
  onSizeChange,
  sizes = PAGINATION_DEFAULTS.sizes,
}) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 2,
      py: 2,
    }}
  >
    <Typography variant="body2" color="text.secondary">
      Page {page + 1} of {totalPages} ({totalItems} items)
    </Typography>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <FormControl size="small">
        <Select value={size} onChange={(e) => onSizeChange?.(e.target.value)}>
          {sizes.map((s) => (
            <MenuItem key={s} value={s}>
              {s} / page
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <IconButton disabled={page <= 0} onClick={() => onPageChange(page - 1)}>
        <ChevronLeftIcon />
      </IconButton>
      <IconButton disabled={page >= totalPages - 1} onClick={() => onPageChange(page + 1)}>
        <ChevronRightIcon />
      </IconButton>
    </Box>
  </Box>
);

export default Pagination;
