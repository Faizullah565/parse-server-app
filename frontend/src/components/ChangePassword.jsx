import { useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box
} from "@mui/material";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword, newPassword })
    });
  };

  return (
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

      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          type="password"
          placeholder="Old Password"
          variant="outlined"
          fullWidth
          size="small"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <TextField
          type="password"
          placeholder="New Password"
          variant="outlined"
          fullWidth
          size="small"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <Button 
          type="submit" 
          variant="contained" 
          color="error"
          sx={{ 
            alignSelf: 'flex-start',
            textTransform: 'none'
          }}
        >
          Change Password
        </Button>
      </Box>
    </Paper>
  );
};

export default ChangePassword;