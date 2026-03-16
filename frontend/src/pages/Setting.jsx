import React, { useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Tabs,
  Tab,
  useTheme,
  useMediaQuery
} from "@mui/material";
import {
  Settings as SettingsIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  Notifications as NotificationsIcon
} from "@mui/icons-material";
import PushNotification from "../components/PushNotification";
import UpdateProfile from "../components/UpdateProfile";
import ChangePassword from "../components/ChangePassword";

// Tab Panel Component
const TabPanel = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const Settings = () => {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
        <SettingsIcon 
          color="primary" 
          sx={{ 
            fontSize: 32,
            backgroundColor: 'primary.light',
            padding: 0.5,
            borderRadius: 2,
            color: 'primary.main'
          }} 
        />
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 700,
            color: 'text.primary'
          }}
        >
          Account Settings
        </Typography>
      </Box>

      {/* Settings Paper */}
      <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {/* Tabs */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant={isMobile ? "fullWidth" : "standard"}
          centered={!isMobile}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'grey.50',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              minHeight: 64,
            }
          }}
        >
          <Tab 
            icon={<PersonIcon />} 
            label="Profile" 
            iconPosition="start"
          />
          <Tab 
            icon={<LockIcon />} 
            label="Password" 
            iconPosition="start"
          />
          <Tab 
            icon={<NotificationsIcon />} 
            label="Notifications" 
            iconPosition="start"
          />
        </Tabs>

        {/* Tab Content */}
        <Box sx={{ p: 3 }}>
          <TabPanel value={tabValue} index={0}>
            <UpdateProfile />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <ChangePassword />
          </TabPanel>
          
          <TabPanel value={tabValue} index={2}>
            <PushNotification />
          </TabPanel>
        </Box>
      </Paper>
    </Container>
  );
};

export default Settings;