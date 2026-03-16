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
  Divider
} from "@mui/material";
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import InfoIcon from '@mui/icons-material/Info';

const PushNotification = () => {
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Check current notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setEnabled(Notification.permission === 'granted');
    }
  }, []);

  const handleToggle = async (event) => {
    const newEnabled = event.target.checked;
    
    if (newEnabled) {
      await handleEnable();
    } else {
      // Note: You can't programmatically disable notifications
      // You need to guide users to browser settings
      setNotificationStatus({
        open: true,
        message: 'To disable notifications, please use your browser settings',
        severity: 'info'
      });
      setEnabled(true); // Revert the toggle
    }
  };

  const handleEnable = async () => {
    try {
      setLoading(true);

      if (!('Notification' in window)) {
        throw new Error('Browser does not support notifications');
      }

      const permission = await Notification.requestPermission();
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

      if (!('serviceWorker' in navigator)) {
        throw new Error('Service workers not supported');
      }

      const registration = await navigator.serviceWorker.ready;
      
      const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
      const convertedVapidKey = urlBase64ToUint8Array(vapidKey);

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      });

      await axios.post("/save-subscription", subscription);

      setNotificationStatus({
        open: true,
        message: 'Notifications enabled successfully!',
        severity: 'success'
      });
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

  const handleCloseSnackbar = () => {
    setNotificationStatus(prev => ({ ...prev, open: false }));
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
            <NotificationsActiveIcon color="primary" />
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

        {!enabled && (
          <Button
            variant="outlined"
            color="primary"
            onClick={handleEnable}
            disabled={loading}
            startIcon={<InfoIcon />}
            fullWidth
            sx={{
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            Learn More About Notifications
          </Button>
        )}

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
          You can manage notification preferences in your browser settings
        </Typography>
      </Paper>

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