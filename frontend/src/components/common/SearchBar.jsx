import { InputAdornment, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({
  value,
  onChange,
  placeholder = 'Search…',
  fullWidth = true,
  size = 'small',
  ...props
}) => (
  <TextField
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    fullWidth={fullWidth}
    size={size}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon fontSize="small" color="action" />
        </InputAdornment>
      ),
    }}
    {...props}
  />
);

export default SearchBar;
