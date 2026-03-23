import { useState, useEffect } from "react";
import axios from "axios";
import {
  Paper,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import SettingsIcon from '@mui/icons-material/Settings';
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';

const PushNotification = () => {
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [openBrowserGuide, setOpenBrowserGuide] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Check current notification permission on mount
  useEffect(() => {
    checkNotificationPermission();
  }, []);

  const checkNotificationPermission = async () => {
    if ('Notification' in window) {
      const isGranted = Notification.permission === 'granted';
      setEnabled(isGranted);
      
      // If permission is granted, also check if we have subscription on server
      if (isGranted) {
        await checkSubscriptionStatus();
      }
    }
  };

  const checkSubscriptionStatus = async () => {
    try {
      const APP_ID = import.meta.env.VITE_PARSE_APP_ID || "parse_server_app";
      const sessionToken = localStorage.getItem("sessionToken");
      
      const response = await axios.post(
        `${import.meta.env.VITE_PARSE_SERVER_URL}/functions/check-subscription`,
        {},
        {
          headers: {
            "X-Parse-Application-Id": APP_ID,
            "X-Parse-Session-Token": sessionToken,
            "Content-Type": "application/json"
          }
        }
      );
      console.log("🚀 ~ checkSubscriptionStatus ~ response:", response)
      
      // If no subscription on server, set enabled false
      if (!response.data?.result?.hasSubscription) {
        setEnabled(false);
      }
    } catch (error) {
      console.error("Error checking subscription:", error);
    }
  };

  const handleToggle = async (event) => {
    const newEnabled = event.target.checked;
    
    if (newEnabled) {
      // Enable notifications
      await handleEnable();
    } else {
      // Disable notifications
      await handleDisable();
    }
  };

  const handleEnable = async () => {
    try {
      setLoading(true);

      if (!('Notification' in window)) {
        throw new Error('Browser does not support notifications');
      }

      // Request permission if not granted
      let permission = Notification.permission;
      if (permission !== 'granted') {
        permission = await Notification.requestPermission();
      }

      const isGranted = permission === "granted";
      setEnabled(isGranted);

      if (!isGranted) {
        setNotificationStatus({
          open: true,
          message: 'Permission denied. Please enable notifications in your browser settings.',
          severity: 'warning'
        });
        return;
      }

      // Setup push notifications
      await setupPushNotifications();

    } catch (err) {
      console.error(err);
      setEnabled(false);
      setNotificationStatus({
        open: true,
        message: err.message || 'Failed to enable notifications',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    try {
      setLoading(true);
      
      // Immediately update UI to show disabled state
      setEnabled(false);
      
      // Remove subscription from server
      await unsubscribeFromPushNotifications();
      
      setNotificationStatus({
        open: true,
        message: 'Notifications disabled successfully. You can also remove browser permissions from settings.',
        severity: 'success'
      });
      
    } catch (error) {
      console.error("Error disabling notifications:", error);
      setNotificationStatus({
        open: true,
        message: 'Failed to disable notifications completely',
        severity: 'warning'
      });
    } finally {
      setLoading(false);
    }
  };

  const setupPushNotifications = async () => {
    try {
      // Register service worker
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker Registered', registration);
        
        // Subscribe to push notifications
        const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY || "BJ5r-MojONyp1f8A5CYl3I_IGg7NKW4sKn8r-FZJ3zyNUzpY-P1OtL-gP_8X7g8xPVVYJ7gTDHluTXGCih4FkWU";
        
        if (!vapidKey) {
          throw new Error("VAPID key missing");
        }
        
        const convertedVapidKey = urlBase64ToUint8Array(vapidKey);
        
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey
        });

        // Save subscription to server
        const APP_ID = import.meta.env.VITE_PARSE_APP_ID || "parse_server_app";
        const sessionToken = localStorage.getItem("sessionToken");

        await axios.post(
          `${import.meta.env.VITE_PARSE_SERVER_URL}/functions/save-subscription`,
          {
            endpoint: subscription.endpoint,
            keys: subscription.toJSON().keys,
          },
          {
            headers: {
              "X-Parse-Application-Id": APP_ID,
              "X-Parse-Session-Token": sessionToken,
              "Content-Type": "application/json"
            }
          }
        );

        setNotificationStatus({
          open: true,
          message: 'Notifications enabled successfully!',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error("Push notification setup error:", error);
      throw error;
    }
  };

  const unsubscribeFromPushNotifications = async () => {
    try {
      // Get active subscription
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        // Unsubscribe from push manager
        await subscription.unsubscribe();
        console.log("Unsubscribed from push manager");
      }

      // Remove from server
      const APP_ID = import.meta.env.VITE_PARSE_APP_ID || "parse_server_app";
      const sessionToken = localStorage.getItem("sessionToken");
      
      await axios.post(
        `${import.meta.env.VITE_PARSE_SERVER_URL}/functions/deactivate-subscription`,
        {
          endpoint: subscription?.endpoint
        },
        {
          headers: {
            "X-Parse-Application-Id": APP_ID,
            "X-Parse-Session-Token": sessionToken,
            "Content-Type": "application/json"
          }
        }
      );
      
      console.log("Removed subscription from server");
    } catch (error) {
      console.error("Error unsubscribing:", error);
      throw error;
    }
  };

  const handleCloseSnackbar = () => {
    setNotificationStatus(prev => ({ ...prev, open: false }));
  };

  const handleOpenBrowserGuide = () => {
    setOpenBrowserGuide(true);
  };

  const handleCloseBrowserGuide = () => {
    setOpenBrowserGuide(false);
  };

  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  // Detect browser
  const getBrowserName = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf("Chrome") > -1) return "Chrome";
    if (userAgent.indexOf("Firefox") > -1) return "Firefox";
    if (userAgent.indexOf("Safari") > -1) return "Safari";
    if (userAgent.indexOf("Edg") > -1) return "Edge";
    return "your browser";
  };

  const getBrowserSettingsSteps = () => {
    const browser = getBrowserName();
    
    const steps = {
      Chrome: [
        "Click the lock icon (🔒) in the address bar",
        "Click on 'Site settings'",
        "Find 'Notifications' in the permissions list",
        "Select 'Block' from the dropdown"
      ],
      Firefox: [
        "Click the shield icon in the address bar",
        "Click on the settings icon next to 'Send Notifications'",
        "Select 'Block' and save changes"
      ],
      Edge: [
        "Click the lock icon (🔒) in the address bar",
        "Click on 'Permissions for this site'",
        "Find 'Notifications' and select 'Block'"
      ],
      Safari: [
        "Go to Safari Menu → Settings",
        "Click on 'Websites' tab",
        "Select 'Notifications' from sidebar",
        "Find this website and select 'Deny'"
      ]
    };

    return steps[browser] || steps.Chrome;
  };

  return (
    <>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: 'background.paper',
          maxWidth: 450,
          mx: 'auto'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {enabled ? (
              <NotificationsActiveIcon color="primary" />
            ) : (
              <NotificationsOffIcon color="action" />
            )}
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Push Notifications
            </Typography>
          </Box>

          {loading ? (
            <CircularProgress size={24} />
          ) : (
            <FormControlLabel
              control={
                <Switch
                  checked={enabled}
                  onChange={handleToggle}
                  color="primary"
                />
              }
              label={enabled ? "Enabled" : "Disabled"}
              labelPlacement="start"
              sx={{ m: 0 }}
            />
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Get instant updates about:
        </Typography>

        <Box component="ul" sx={{ pl: 2, mb: 3 }}>
          <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            • Order confirmations and updates
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            • Exclusive offers and promotions
          </Typography>
          <Typography component="li" variant="body2" color="text.secondary">
            • Important account notifications
          </Typography>
        </Box>

        <Button
          variant="outlined"
          color="info"
          onClick={handleOpenBrowserGuide}
          startIcon={<SettingsIcon />}
          fullWidth
          sx={{
            textTransform: 'none',
            fontWeight: 500,
            mb: 2
          }}
        >
          Browser Settings Guide
        </Button>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
          {enabled 
            ? "Toggle off to disable app notifications" 
            : "Toggle on to enable notifications"}
        </Typography>
      </Paper>

      {/* Browser Settings Guide Dialog */}
      <Dialog 
        open={openBrowserGuide} 
        onClose={handleCloseBrowserGuide}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SettingsIcon color="primary" />
          <Typography variant="h6">
            Browser Settings Guide - {getBrowserName()}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Follow these steps to completely manage notifications in your browser:
          </Typography>
          
          <List>
            {getBrowserSettingsSteps().map((step, index) => (
              <ListItem key={index} sx={{ px: 0 }}>
                <ListItemIcon>
                  <Box sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    bgcolor: 'primary.main', 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    fontWeight: 'bold'
                  }}>
                    {index + 1}
                  </Box>
                </ListItemIcon>
                <ListItemText primary={step} />
              </ListItem>
            ))}
          </List>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Note:</strong> Browser settings affect all websites. 
              You can always enable notifications again from the same settings.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBrowserGuide} color="primary">
            Got it
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notificationStatus.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={notificationStatus.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notificationStatus.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PushNotification;