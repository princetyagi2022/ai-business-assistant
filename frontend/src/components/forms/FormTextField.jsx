import { TextField } from '@mui/material';
import { Controller } from 'react-hook-form';

const FormTextField = ({ name, control, label, ...props }) => (
  <Controller
    name={name}
    control={control}
    render={({ field, fieldState }) => (
      <TextField
        {...field}
        {...props}
        label={label}
        fullWidth
        margin="normal"
        error={Boolean(fieldState.error)}
        helperText={fieldState.error?.message}
      />
    )}
  />
);

export default FormTextField;
