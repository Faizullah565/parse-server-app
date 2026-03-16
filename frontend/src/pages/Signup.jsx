// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider
} from "@mui/material";
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Store as StoreIcon
} from "@mui/icons-material";
import { signupUser } from "../services/authService";

export default function Signup() {
  const navigate = useNavigate();
  
  // Individual state variables instead of formData
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const validateForm = () => {
    if (!email) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email is invalid");
      return false;
    }
    if (!password) {
      setError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (!confirmPassword) {
      setError("Please confirm your password");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await signupUser(email, password, role);
    if(!res.result.success){
      throw new Error(res.result.message)
    }
      
      setMessage("Signup successful! Redirecting to login...");
      
      // Clear form
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setRole("user");
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          marginBottom: 4,
          display: "flex",
          justifyContent: "center"
        }}
      >
        <Paper elevation={4} sx={{ padding: 4, width: "100%" }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            {role === "seller" ? (
              <StoreIcon sx={{ fontSize: 60, color: 'primary.main', mb: 1 }} />
            ) : (
              <PersonIcon sx={{ fontSize: 60, color: 'primary.main', mb: 1 }} />
            )}
            <Typography variant="h4" align="center" gutterBottom>
              Create {role === "seller" ? "Seller" : "User"} Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Join as a {role === "seller" ? "seller to start selling your products" : "user to start shopping"}
            </Typography>
          </Box>

          {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSignup} sx={{ mt: 2 }}>
            <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
              <FormLabel component="legend">I want to sign up as:</FormLabel>
              <RadioGroup
                row
                value={role}
                onChange={(e) => setRole(e.target.value)}
                sx={{ justifyContent: 'center', gap: 4 }}
              >
                <FormControlLabel 
                  value="user" 
                  control={<Radio />} 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon fontSize="small" />
                      <span>User</span>
                    </Box>
                  } 
                />
                <FormControlLabel 
                  value="seller" 
                  control={<Radio />} 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <StoreIcon fontSize="small" />
                      <span>Seller</span>
                    </Box>
                  } 
                />
              </RadioGroup>
            </FormControl>

            <Divider sx={{ mb: 3 }} />

            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              required
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              fullWidth
              required
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={toggleConfirmPasswordVisibility}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ 
                mt: 3, 
                mb: 2,
                py: 1.5,
                position: 'relative'
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ position: 'absolute' }} />
              ) : (
                `Sign Up as ${role === "seller" ? "Seller" : "User"}`
              )}
            </Button>

            <Typography variant="body2" color="text.secondary" align="center">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </Typography>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2">
                Already have an account?{" "}
                <Button 
                  variant="text" 
                  onClick={() => navigate("/login")}
                  sx={{ textTransform: 'none' }}
                >
                  Log In
                </Button>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}