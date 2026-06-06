import { useState } from 'react';
import { Box, Tabs, Tab, Card, CardContent, Typography, Switch, FormControlLabel, TextField, Button, Grid } from '@mui/material';
import PageHeader from '@/components/common/PageHeader';
import { useThemeMode } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

const TabPanel = ({ children, value, index }) => (
  value === index ? <Box sx={{ pt: 2 }}>{children}</Box> : null
);

const SettingsPage = () => {
  const [tab, setTab] = useState(0);
  const { mode, toggleTheme } = useThemeMode();
  const { user } = useAuth();

  return (
    <>
      <PageHeader title="Settings" subtitle="Manage your account and application preferences" />
      <Card>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tab label="Profile" />
          <Tab label="Appearance" />
          <Tab label="Notifications" />
          <Tab label="Security" />
        </Tabs>
        <CardContent>
          <TabPanel value={tab} index={0}>
            <Grid container spacing={2} maxWidth="md">
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="First name" defaultValue={user?.firstName} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Last name" defaultValue={user?.lastName} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Email" defaultValue={user?.email} disabled />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained">Save profile</Button>
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <FormControlLabel
              control={<Switch checked={mode === 'dark'} onChange={toggleTheme} />}
              label="Dark mode"
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Current theme: {mode}
            </Typography>
          </TabPanel>
          <TabPanel value={tab} index={2}>
            <FormControlLabel control={<Switch defaultChecked />} label="Email notifications" />
            <FormControlLabel control={<Switch defaultChecked />} label="Push notifications" />
            <FormControlLabel control={<Switch />} label="Marketing updates" />
          </TabPanel>
          <TabPanel value={tab} index={3}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Change your password or enable two-factor authentication.
            </Typography>
            <Button variant="outlined" sx={{ mt: 1 }}>
              Change password
            </Button>
          </TabPanel>
        </CardContent>
      </Card>
    </>
  );
};

export default SettingsPage;
