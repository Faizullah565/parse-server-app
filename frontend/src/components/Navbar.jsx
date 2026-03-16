import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Container,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider
} from "@mui/material";
import {
  Menu as MenuIcon,
  ShoppingCart,
  Person,
  Logout,
  ShoppingBag
} from "@mui/icons-material";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { text: 'Products', path: '/products', icon: <ShoppingBag /> },
    { text: 'Cart', path: '/cart', icon: <ShoppingCart /> },
    { text: 'Profile', path: '/profile', icon: <Person /> },
    { text: 'Logout', path: '/', icon: <Logout /> },
  ];

  return (
    <AppBar position="static" sx={{ bgcolor: 'grey.800' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: 'white' }}>
            <ShoppingCart />
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              MyLogo
            </Typography>
          </Box>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 3 }}>
            <Button color="inherit" component={RouterLink} to="/products">
              Products
            </Button>
            <IconButton color="inherit" component={RouterLink} to="/cart">
              <ShoppingCart />
            </IconButton>
            <IconButton color="inherit" component={RouterLink} to="/profile">
              <Person />
            </IconButton>
            <Button 
              color="inherit" 
              component={RouterLink} 
              to="/" 
              startIcon={<Logout />}
            >
              Logout
            </Button>
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            onClick={() => setIsOpen(!isOpen)}
            sx={{ display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Mobile Drawer */}
          <Drawer
            anchor="right"
            open={isOpen}
            onClose={() => setIsOpen(false)}
          >
            <Box sx={{ width: 250 }} role="presentation">
              <List>
                {menuItems.map((item) => (
                  <ListItem key={item.text} disablePadding>
                    <ListItemButton 
                      component={RouterLink} 
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                    >
                      <ListItemIcon>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText primary={item.text} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Drawer>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;