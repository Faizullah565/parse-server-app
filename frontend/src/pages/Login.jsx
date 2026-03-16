// src/pages/Login.jsx
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
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider
} from "@mui/material";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Login as LoginIcon
} from "@mui/icons-material";
import { loginUser } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();
  
  // Individual state variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const user = await loginUser(email, password);
      console.log("🚀 ~ handleLogin ~ user:", user)
      
      // Redirect based on user role
      const userRole = user?.user?.role;
      localStorage.setItem("sessionToken", user?.user?.sessionToken);
      if(!user.success){
        throw new Error(user.message)
      }
      if (userRole === "seller") {
        navigate("/profile/my-products");
      } else {
        navigate("/profile");
      }
      
    } catch (err) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
            <LoginIcon sx={{ fontSize: 60, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" align="center" gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to your account
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleLogin} sx={{ mt: 2 }}>
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

            <Box sx={{ textAlign: 'right', mt: 1 }}>
              <Button 
                variant="text" 
                size="small"
                onClick={() => navigate("/forgot-password")}
                sx={{ textTransform: 'none' }}
              >
                Forgot Password?
              </Button>
            </Box>

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
                "Sign In"
              )}
            </Button>

            <Divider sx={{ my: 2 }}>New here?</Divider>

            <Button
              variant="outlined"
              fullWidth
              size="large"
              onClick={() => navigate("/signup")}
              sx={{ py: 1.5 }}
            >
              Create Account
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}