import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './ThemeContext';
import { AuthProvider } from './AuthContext';

const AppProviders = ({ children }) => (
  <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>{children}</BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
);

export default AppProviders;
