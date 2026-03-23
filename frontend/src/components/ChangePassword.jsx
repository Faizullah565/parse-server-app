import { useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Snackbar,
  FormHelperText,
  InputAdornment,
  IconButton
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { changePassword } from '../services/authService.js'; // Assuming you have this service

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const passwordRequirements = {
    minLength: 8,
    hasUpperCase: /[A-Z]/,
    hasLowerCase: /[a-z]/,
    hasNumbers: /\d/,
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/
  };

  const validatePassword = (password) => {
    const errors = [];
    
    if (password.length < passwordRequirements.minLength) {
      errors.push(`at least ${passwordRequirements.minLength} characters`);
    }
    if (!passwordRequirements.hasUpperCase.test(password)) {
      errors.push("one uppercase letter");
    }
    if (!passwordRequirements.hasLowerCase.test(password)) {
      errors.push("one lowercase letter");
    }
    if (!passwordRequirements.hasNumbers.test(password)) {
      errors.push("one number");
    }
    if (!passwordRequirements.hasSpecialChar.test(password)) {
      errors.push("one special character");
    }
    
    return errors;
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Old password validation
    if (!formData.oldPassword) {
      newErrors.oldPassword = "Current password is required";
    }
    
    // New password validation
    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else {
      const passwordErrors = validatePassword(formData.newPassword);
      if (passwordErrors.length > 0) {
        newErrors.newPassword = `Password must contain: ${passwordErrors.join(", ")}`;
      }
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field) => (e) => {
    setFormData({
      ...formData,
      [field]: e.target.value
    });
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null
      });
    }
  };

  const handleTogglePassword = (field) => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Call your API to change password
      const response = await changePassword({
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword
      });
      
      setSnackbar({
        open: true,
        message: "Password changed successfully!",
        severity: "success"
      });
      
      // Clear form
      setFormData({
          oldPassword: "",
          newPassword: "",
        confirmPassword: ""
      });
      
    } catch (error) {
      // console.log("🚀 ~ handleSubmit ~ error:", error)
      setSnackbar({
        open: true,
        message: error.response?.data?.message || error.Error || "Failed to change password",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          borderRadius: 2,
          bgcolor: 'white',
          width: '100%'
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Change Password
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Old Password */}
          <Box>
            <TextField
              type={showPassword.old ? "text" : "password"}
              placeholder="Current Password"
              variant="outlined"
              fullWidth
              size="small"
              value={formData.oldPassword}
              onChange={handleChange("oldPassword")}
              error={!!errors.oldPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleTogglePassword("old")}
                      edge="end"
                      size="small"
                    >
                      {showPassword.old ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            {errors.oldPassword && (
              <FormHelperText error>{errors.oldPassword}</FormHelperText>
            )}
          </Box>

          {/* New Password */}
          <Box>
            <TextField
              type={showPassword.new ? "text" : "password"}
              placeholder="New Password"
              variant="outlined"
              fullWidth
              size="small"
              value={formData.newPassword}
              onChange={handleChange("newPassword")}
              error={!!errors.newPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleTogglePassword("new")}
                      edge="end"
                      size="small"
                    >
                      {showPassword.new ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            {errors.newPassword && (
              <FormHelperText error>{errors.newPassword}</FormHelperText>
            )}
          </Box>

          {/* Confirm Password */}
          <Box>
            <TextField
              type={showPassword.confirm ? "text" : "password"}
              placeholder="Confirm New Password"
              variant="outlined"
              fullWidth
              size="small"
              value={formData.confirmPassword}
              onChange={handleChange("confirmPassword")}
              error={!!errors.confirmPassword}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleTogglePassword("confirm")}
                      edge="end"
                      size="small"
                    >
                      {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            {errors.confirmPassword && (
              <FormHelperText error>{errors.confirmPassword}</FormHelperText>
            )}
          </Box>

          {/* Password Requirements Hint */}
          {formData.newPassword && !errors.newPassword && (
            <Alert severity="info" sx={{ mt: 1, py: 0 }}>
              <Typography variant="caption" component="div">
                Password must contain:
              </Typography>
              <Typography variant="caption" component="div" sx={{ ml: 2 }}>
                • At least {passwordRequirements.minLength} characters
              </Typography>
              <Typography variant="caption" component="div" sx={{ ml: 2 }}>
                • Uppercase and lowercase letters
              </Typography>
              <Typography variant="caption" component="div" sx={{ ml: 2 }}>
                • At least one number
              </Typography>
              <Typography variant="caption" component="div" sx={{ ml: 2 }}>
                • At least one special character
              </Typography>
            </Alert>
          )}

          <Button 
            type="submit" 
            variant="contained" 
            color="error"
            disabled={loading}
            sx={{ 
              alignSelf: 'flex-start',
              textTransform: 'none',
              mt: 1,
              px: 3
            }}
          >
            {loading ? "Changing..." : "Change Password"}
          </Button>
        </Box>
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ChangePassword;