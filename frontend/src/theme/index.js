import { createTheme } from '@mui/material/styles';
import { getPalette } from './palette';

export const createAppTheme = (mode = 'light') => {
  const palette = getPalette(mode);

  return createTheme({
    palette,
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 700, fontSize: '2.25rem' },
      h2: { fontWeight: 700, fontSize: '1.875rem' },
      h3: { fontWeight: 600, fontSize: '1.5rem' },
      h4: { fontWeight: 600, fontSize: '1.25rem' },
      h5: { fontWeight: 600, fontSize: '1.125rem' },
      h6: { fontWeight: 600, fontSize: '1rem' },
      subtitle1: { fontWeight: 500 },
      subtitle2: { fontWeight: 500, fontSize: '0.875rem' },
      body1: { fontSize: '0.9375rem' },
      body2: { fontSize: '0.875rem' },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: { borderRadius: 10 },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { borderRadius: 8, padding: '8px 20px' },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow:
              mode === 'light'
                ? '0 1px 3px rgba(26, 35, 50, 0.08)'
                : '0 1px 3px rgba(0, 0, 0, 0.4)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          rounded: { borderRadius: 12 },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: { fontWeight: 600 },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: { borderRight: `1px solid ${palette.divider}` },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            boxShadow: 'none',
            borderBottom: `1px solid ${palette.divider}`,
          },
        },
      },
    },
  });
};

export default createAppTheme;
