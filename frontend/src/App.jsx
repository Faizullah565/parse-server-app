// src/App.jsx
import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
// import { initializeParse } from "./parse/config";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import UserProfile from "./pages/UserProfile";
import Settings from "./pages/Setting";
import AddProduct from "./pages/AddProduct";
import Profile from "./pages/Profile";
// import UserProfile from "./pages/UserProfile";
// import Profile from "./pages/Profile";
// import Settings from "./pages/Settings";
import MyProducts from "./pages/MyProducts";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
// import AddProduct from "./pages/AddProduct";

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
  },
  shape: {
    borderRadius: 8,
  },
});

function App() {
  useEffect(() => {
    // Initialize Parse
    // initializeParse();

    // Register Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);
        })
        .catch((error) => {
          console.log("Service Worker registration failed:", error);
        });
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            
            <Route path="/profile" element={<UserProfile />}>
              <Route index element={<Profile />} />
              <Route path="settings" element={<Settings />} />
              <Route path="my-products" element={<MyProducts />} />
              <Route path="add-product" element={<AddProduct />} />
            </Route>
          </Routes>
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App;