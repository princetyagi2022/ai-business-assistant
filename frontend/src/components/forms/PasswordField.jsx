import { useState } from 'react';
import { IconButton, InputAdornment } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import FormTextField from './FormTextField';

const PasswordField = ({ name, control, label = 'Password', ...props }) => {
  const [show, setShow] = useState(false);

  return (
    <FormTextField
      name={name}
      control={control}
      label={label}
      type={show ? 'text' : 'password'}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => setShow((s) => !s)} edge="end" aria-label="toggle password">
              {show ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
};

export default PasswordField;
