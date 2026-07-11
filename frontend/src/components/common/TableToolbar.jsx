import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SearchBar from './SearchBar';

const TableToolbar = ({
  search,
  onSearchChange,
  searchPlaceholder = 'Search rows...',
  filters = {},
  filterOptions = [],
  onFilterChange,
  onReset,
}) => {
  const hasFilters = Object.values(filters).some(Boolean) || Boolean(search);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 1.5,
        mb: 2,
      }}
    >
      <Box sx={{ flex: '1 1 280px', maxWidth: 420 }}>
        <SearchBar
          value={search}
          onChange={(event) => onSearchChange?.(event.target.value)}
          placeholder={searchPlaceholder}
        />
      </Box>

      {filterOptions.map((filter) => (
        <FormControl key={filter.id} size="small" sx={{ minWidth: 160 }}>
          <InputLabel>{filter.label}</InputLabel>
          <Select
            label={filter.label}
            value={filters[filter.id] || ''}
            onChange={(event) => onFilterChange?.(filter.id, event.target.value)}
            startAdornment={<FilterListIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />}
          >
            <MenuItem value="">All</MenuItem>
            {filter.options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}

      {hasFilters && (
        <Button variant="text" startIcon={<RestartAltIcon />} onClick={onReset}>
          Reset
        </Button>
      )}
    </Box>
  );
};

export default TableToolbar;
