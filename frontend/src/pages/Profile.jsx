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

const Profile = () => {
  const user = {
    name: "Faizullah",
    email: "ali@example.com",
    phone: "03001234567",
    role: "user",
    createdAt: "2025-12-10T10:20:30Z"
  };

  const getInitials = (name) => {
    return name.charAt(0).toUpperCase();
  };

  const formatDate = (dateString) => {
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
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        My Profile
      </Typography>

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
            {getInitials(user.name)}
          </Avatar>
          
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {user.name}
            </Typography>
            <Typography color="text.secondary">
              {user.email}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* User Info Grid */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <InfoRow label="Full Name" value={user.name} />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <InfoRow label="Email" value={user.email} />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <InfoRow label="Phone" value={user.phone || "Not provided"} />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <InfoRow 
              label="Role" 
              value={user.role.charAt(0).toUpperCase() + user.role.slice(1)} 
            />
          </Grid>
          
          <Grid item xs={12}>
            <InfoRow label="Account Created" value={formatDate(user.createdAt)} />
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
          >
            Edit Profile
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;