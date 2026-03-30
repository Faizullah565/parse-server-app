import { Box, Typography, IconButton, Menu, MenuItem, Avatar } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Parse from "../../../utils/parseClient";
import { useAuth } from "../../context/AuthContext";

const Topbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const {user, logout} = useAuth()
  // const user = JSON.parse(localStorage.getItem("user")); // ya context se lo


  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await Parse.User.logOut();
    logout()
    navigate("/login");
  };

  return (
    <Box
      sx={{
        height: 64,
        bgcolor: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 3,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      {/* LEFT SIDE */}
      <Typography variant="h6" fontWeight="bold">
        Admin Panel
      </Typography>

      {/* RIGHT SIDE */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography>{user?.name}</Typography>

        <IconButton onClick={handleMenuOpen}>
          <Avatar src={user?.image} />
        </IconButton>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          <MenuItem disabled>{user?.email}</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Topbar;