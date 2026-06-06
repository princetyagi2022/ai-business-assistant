import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { Controller } from 'react-hook-form';

const FormSelect = ({ name, control, label, options = [], ...props }) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <FormControl fullWidth margin="normal" error={Boolean(fieldState.error)}>
        <InputLabel>{label}</InputLabel>
        <Select {...field} {...props} label={label}>
          {options.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
        {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
      </FormControl>
    )}
  />
);

export default FormSelect;
