import { useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Snackbar,
  Avatar,
  InputAdornment,
  Divider,
  Grid,
  Chip
} from "@mui/material";
import {
  Person as PersonIcon,
  Phone as PhoneIcon,
  Save as SaveIcon,
  Verified as VerifiedIcon,
  Edit as EditIcon
} from "@mui/icons-material";
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  maxWidth: 600,
  margin: '0 auto',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  }
}));

const UpdateProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      setNotification({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error(error);
      setNotification({
        open: true,
        message: error.message || 'Failed to update profile',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      <StyledPaper elevation={3}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'success.main', width: 60, height: 60 }}>
              <EditIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Update Profile
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Keep your information up to date
              </Typography>
            </Box>
          </Box>
          <Chip 
            icon={<VerifiedIcon />} 
            label="Verified Account" 
            color="success" 
            variant="outlined"
          />
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Box 
          component="form" 
          onSubmit={handleSubmit}
        >
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Full Name"
                placeholder="Enter your full name"
                variant="outlined"
                fullWidth
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color={errors.name ? 'error' : 'action'} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                name="phone"
                label="Phone Number"
                placeholder="Enter your 10-digit phone number"
                variant="outlined"
                fullWidth
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color={errors.phone ? 'error' : 'action'} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="success"
                size="large"
                disabled={loading}
                startIcon={loading ? <SaveIcon /> : <SaveIcon />}
                fullWidth
                sx={{
                  py: 1.8,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 2,
                  fontSize: '1.1rem',
                  '&:hover': {
                    backgroundColor: 'success.dark',
                  }
                }}
              >
                {loading ? 'Updating Profile...' : 'Save Changes'}
              </Button>
            </Grid>
          </Grid>
        </Box>

        <Box 
          sx={{ 
            mt: 4,
            p: 2,
            bgcolor: 'grey.50',
            borderRadius: 2,
            border: 1,
            borderColor: 'divider'
          }}
        >
          <Typography variant="body2" color="text.secondary" align="center">
            <strong>Note:</strong> Your phone number will be used for order updates and account verification.
            We'll never share your information with third parties.
          </Typography>
        </Box>
      </StyledPaper>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          variant="filled"
          elevation={6}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UpdateProfile;