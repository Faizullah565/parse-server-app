import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  useTheme,
  useMediaQuery,
  Drawer,
  IconButton,
  Typography,
  Breadcrumbs,
  Link,
  Avatar
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ChevronRight as ChevronRightIcon,
  AdminPanelSettings as AdminIcon
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import Sidebar from "../components/Sidebar"; // your admin sidebar

const AdminLayout = () => {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Breadcrumbs
  const pathnames = location.pathname.split("/").filter(x => x);

  const getPageTitle = () => {
    const lastPath = pathnames[pathnames.length - 1];
    if (!lastPath) return "Admin Dashboard";
    return lastPath.charAt(0).toUpperCase().replace(/-/g, " ") + lastPath.slice(1);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "grey.50" }}>

      {/* ===== Mobile Header ===== */}
      {isMobile && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            height: 64,
            bgcolor: "primary.main",
            color: "white",
            display: "flex",
            alignItems: "center",
            px: 2,
            zIndex: 1100,
            boxShadow: 2
          }}
        >
          <IconButton color="inherit" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Avatar sx={{ bgcolor: "primary.dark", width: 32, height: 32 }}>
              <AdminIcon fontSize="small" />
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Admin Panel
            </Typography>
          </Box>
        </Box>
      )}

      {/* ===== Desktop Sidebar ===== */}
      {!isMobile && (
        <Box
          component="aside"
          sx={{
            width: 280,
            flexShrink: 0,
            borderRight: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            height: "100vh",
            position: "sticky",
            top: 0,
            overflowY: "auto",
          }}
        >
          <Sidebar />
        </Box>
      )}

      {/* ===== Mobile Drawer ===== */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { width: 280 }
        }}
      >
        <Sidebar onClose={handleDrawerToggle} />
      </Drawer>

      {/* ===== Main Content ===== */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          width: { md: "calc(100% - 280px)" },
          mt: isMobile ? 8 : 0,
        }}
      >
        <Container maxWidth="xl">

          {/* ===== Breadcrumbs ===== */}
          <Breadcrumbs
            separator={<ChevronRightIcon fontSize="small" />}
            sx={{ mb: 3 }}
          >
            <Link
              component={RouterLink}
              to="/admin"
              color="inherit"
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <DashboardIcon fontSize="small" />
              Admin
            </Link>

            {pathnames.slice(1).map((name, index) => {
              const routeTo = `/admin/${pathnames.slice(1, index + 2).join("/")}`;
              const isLast = index === pathnames.length - 2;

              const displayName =
                name.charAt(0).toUpperCase() +
                name.slice(1).replace(/-/g, " ");

              return isLast ? (
                <Typography key={name} color="text.primary">
                  {displayName}
                </Typography>
              ) : (
                <Link
                  key={name}
                  component={RouterLink}
                  to={routeTo}
                  color="inherit"
                >
                  {displayName}
                </Link>
              );
            })}
          </Breadcrumbs>

          {/* ===== Page Title ===== */}
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
            {getPageTitle()}
          </Typography>

          {/* ===== Content ===== */}
          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              borderRadius: 3,
              minHeight: "calc(100vh - 240px)",
              bgcolor: "background.paper"
            }}
          >
            <Outlet />
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default AdminLayout;