import { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { createAppTheme } from '@/theme';
import { getThemeMode, setThemeMode } from '@/utils/storage';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => getThemeMode());

  const toggleTheme = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      setThemeMode(next);
      return next;
    });
  }, []);

  const setTheme = useCallback((newMode) => {
    setThemeMode(newMode);
    setMode(newMode);
  }, []);

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  const value = useMemo(
    () => ({ mode, toggleTheme, setTheme, isDark: mode === 'dark' }),
    [mode, toggleTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeMode = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeMode must be used within ThemeProvider');
  return ctx;
};

export default ThemeContext;
