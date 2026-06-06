export const brandColors = {
  primary: {
    main: '#1565C0',
    light: '#5E92F3',
    dark: '#003C8F',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#7B1FA2',
    light: '#AE52D4',
    dark: '#4A0072',
    contrastText: '#ffffff',
  },
  success: {
    main: '#2E7D32',
    light: '#60AD5E',
    dark: '#005005',
  },
  warning: {
    main: '#ED6C02',
    light: '#FF9800',
    dark: '#E65100',
  },
  error: {
    main: '#D32F2F',
    light: '#EF5350',
    dark: '#C62828',
  },
  info: {
    main: '#0288D1',
    light: '#03A9F4',
    dark: '#01579B',
  },
  grey: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
};

export const getPalette = (mode) => ({
  mode,
  primary: brandColors.primary,
  secondary: brandColors.secondary,
  success: brandColors.success,
  warning: brandColors.warning,
  error: brandColors.error,
  info: brandColors.info,
  background: {
    default: mode === 'light' ? '#F4F6F8' : '#0F1419',
    paper: mode === 'light' ? '#FFFFFF' : '#1A2332',
  },
  text: {
    primary: mode === 'light' ? '#1A2332' : '#E8EDF5',
    secondary: mode === 'light' ? '#5C6B7A' : '#9AA8B8',
  },
  divider: mode === 'light' ? '#E8ECF0' : '#2A3544',
});
