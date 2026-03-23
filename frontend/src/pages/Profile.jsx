import React from "react";
import {
  Container,
  Paper,
  Typography,
  Avatar,
  Grid,
  Button,
  Box,
  Divider
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { useEffect } from "react";
import { useState } from "react";
import { getUserProfile } from '../services/authService.js'
import { useNavigate } from "react-router-dom";
const Profile = () => {
  const [user, setUser] = useState({})

  const navigate = useNavigate()
  useEffect(() => {
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const profile = await getUserProfile();
      const data = profile?.result;

    // CLEAN DATA HERE (MAIN FIX)
    const cleanedUser = {
      ...data,
      role:
        typeof data?.role === "object"
          ? data?.role?.name || "user"
          : data?.role,
      createdAt:
        typeof data?.createdAt === "object"
          ? data?.createdAt?.iso || null
          : data?.createdAt,
    }; 
    setUser(cleanedUser);// Set user state
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    }
  }

  const getInitials = (name) => {
    return name?.charAt(0).toUpperCase();
  };

  const formatDate = (dateString) => {
  if (!dateString) return "N/A"; // handle undefined/null
  return new Date(dateString).toLocaleDateString();
};

  const InfoRow = ({ label, value }) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 500 }}>
        {value}
      </Typography>
    </Box>
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {/* <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        My Profile
      </Typography> */}

      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        {/* Avatar Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
          <Avatar
            sx={{
              width: 70,
              height: 70,
              bgcolor: 'grey.300',
              color: 'grey.700',
              fontSize: '1.8rem',
              fontWeight: 'bold'
            }}
          >
            {
            user.image? <img src={user?.image} alt="" />
            : getInitials(user?.name)
             }
          </Avatar>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {user?.name}
            </Typography>
            <Typography color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* User Info Grid */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <InfoRow label="Full Name" value={user?.name} />
          </Grid>

          <Grid item xs={12} md={6}>
            <InfoRow label="Email" value={user?.email} />
          </Grid>

          <Grid item xs={12} md={6}>
            <InfoRow label="Phone" value={user?.phone || "Not provided"} />
          </Grid>

          <Grid item xs={12} md={6}>
            <InfoRow
              label="Role"
              value={user?.role}
            />
          </Grid>

          <Grid item xs={12}>
            <InfoRow label="Account Created" value={formatDate(user?.createdAt)} />
          </Grid>
        </Grid>

        {/* Edit Button */}
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<EditIcon />}
            sx={{
              px: 4,
              py: 1,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 500
            }}
          onClick={()=>navigate("settings")}
          >
            Edit Profile
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;