import { useState } from "react";
import { NavLink as RouterNavLink, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Drawer,
  useTheme,
  useMediaQuery
} from "@mui/material";

import {
  Dashboard,
  ShoppingCart,
  Inventory,
  People,
  Settings,
  Logout,
  AdminPanelSettings,
  Menu as MenuIcon
} from "@mui/icons-material";

import { useAuth } from "../../context/AuthContext";
import Parse from "../../../utils/parseClient";

const Sidebar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const { logout } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    try {
      await Parse.User.logOut();
      logout();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Admin Menu
  const menuItems = [
    { text: "Dashboard", path: "/admin", icon: <Dashboard /> },
    { text: "Orders", path: "/admin/orders", icon: <ShoppingCart /> },
    // { text: "Products", path: "/admin/products", icon: <Inventory /> },
    { text: "Users", path: "/admin/users", icon: <People /> },
    { text: "Settings", path: "/admin/settings", icon: <Settings /> },
  ];

  // ===== Sidebar Content =====
  const sidebarContent = (
    <Box sx={{ width: 280, p: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
        <AdminPanelSettings color="primary" />
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Admin Panel
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Menu */}
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={RouterNavLink}
              to={item.path}
              sx={{
                borderRadius: 1,
                "&.active": {
                  backgroundColor: "primary.light",
                  color: "primary.contrastText",
                  "& .MuiListItemIcon-root": {
                    color: "primary.contrastText",
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}

        <Divider sx={{ my: 2 }} />

        {/* Logout */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 1,
              color: "error.main",
              "&:hover": {
                backgroundColor: "error.light",
                color: "white",
                "& .MuiListItemIcon-root": {
                  color: "white",
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  // ===== Mobile View =====
  if (isMobile) {
    return (
      <>
        {/* Top Tabs */}
        <Paper
          square
          elevation={1}
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
            <IconButton onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" sx={{ ml: 2, fontWeight: "bold" }}>
              Admin Panel
            </Typography>
          </Box>

          <Tabs
            value={activeTab}
            onChange={(e, newValue) => {
              setActiveTab(newValue);
              navigate(menuItems[newValue].path);
            }}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ px: 1 }}
          >
            {menuItems.map((item) => (
              <Tab
                key={item.text}
                icon={item.icon}
                label={item.text}
                iconPosition="start"
                sx={{ minHeight: 48 }}
              />
            ))}
          </Tabs>
        </Paper>

        {/* Drawer */}
        <Drawer open={mobileOpen} onClose={handleDrawerToggle}>
          {sidebarContent}
        </Drawer>
      </>
    );
  }

  // ===== Desktop View =====
  return (
    <Paper
      elevation={0}
      sx={{
        width: 280,
        borderRight: "1px solid",
        borderColor: "divider",
        borderRadius: 0,
        height: "100%",
        backgroundColor: "background.paper",
      }}
    >
      {sidebarContent}
    </Paper>
  );
};

export default Sidebar;