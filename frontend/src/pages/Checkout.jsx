import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  Button,
  Grid,
  Divider,
  IconButton,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Alert,
  Chip,
  Avatar,
  Container,
  Badge,
  Zoom,
  Fade
} from "@mui/material";
import {
  ArrowBack,
  ShoppingBag,
  LocalShipping,
  Payment,
  Lock,
  LocationOn,
  Phone,
  Person,
  Home,
  CheckCircle,
  KeyboardArrowRight,
  ShoppingCart,
  Discount
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import { createConfirmOrder } from "../services/orderService";
import { useEffect } from "react";

// Styled Components
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  color: "white",
  padding: "12px 24px",
  borderRadius: 12,
  fontWeight: 600,
  textTransform: "none",
  fontSize: "1.1rem",
  transition: "all 0.3s ease",
  "&:hover": {
    background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
    transform: "scale(1.02)",
    boxShadow: "0 10px 20px rgba(102, 126, 234, 0.3)",
  },
  "&:disabled": {
    background: "linear-gradient(135deg, #cbd5e0 0%, #a0aec0 100%)",
  },
}));

const SummaryItem = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: theme.spacing(1.5, 0),
  borderBottom: `1px dashed ${theme.palette.divider}`,
  "&:last-of-type": {
    borderBottom: "none",
  },
}));

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, clearCartState } = useCart();
  const [activeStep, setActiveStep] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState("standard");

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    city: "",
    address: "",
    email: "",
  });

  const [errors, setErrors] = useState({});

  const steps = ["Cart Review", "Shipping", "Payment"];

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  let shippingCost = deliveryOption === "express" ? 299 : 0;
  if(deliveryOption === "COD") {
    shippingCost=350
  };
  const discount = promoApplied ? subtotal * 0.1 : 0; // 10% discount
  const total = subtotal + shippingCost - discount;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateShipping = () => {
    const newErrors = {};
    if (!address.name) newErrors.name = "Name is required";
    if (!address.phone) newErrors.phone = "Phone is required";
    else if (!/^\d{10,}$/.test(address.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Enter a valid phone number";
    }
    if (!address.city) newErrors.city = "City is required";
    if (!address.address) newErrors.address = "Address is required";
    if (!address.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(address.email)) {
      newErrors.email = "Enter a valid email";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
      }
      setActiveStep(1);
    } else if (activeStep === 1) {
      if (validateShipping()) {
        setActiveStep(2);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleConfirmOrder = async() => {

    if (!address.name || !address.phone || !address.city || !address.address || !address.email) {
      toast.warning("Please fill all shipping details!");
      return;
    }

    try {
        const response = await createConfirmOrder(address, deliveryOption)
        clearCartState()
        console.log(" Order Confirmed", { cart, address, deliveryOption, total });
        toast.success("Order placed successfully!");
        // Navigate to success page or clear cart
        navigate("/profile/orders")
    } catch (error) {
        toast.error(error)
    }
  };

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "SAVE10") {
      setPromoApplied(true);
      alert("Promo code applied! 10% discount");
    } else {
      alert("Invalid promo code");
    }
  };

  useEffect(()=>{
    if(cart.length==0){
        navigate("/cart")
    }
  }, [])

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Fade in={true}>
            <Box>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShoppingBag color="primary" />
                Your Items ({cart.length})
              </Typography>
              
              {cart.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <ShoppingCart sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography color="text.secondary" gutterBottom>
                    Your cart is empty
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate("/")}
                    sx={{ mt: 2 }}
                  >
                    Continue Shopping
                  </Button>
                </Paper>
              ) : (
                cart.map((item, index) => (
                  <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }} key={item.objectId}>
                    <Paper
                      elevation={0}
                      sx={{
                        mb: 2,
                        borderRadius: 3,
                        overflow: "hidden",
                        border: "1px solid",
                        borderColor: "divider",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          borderColor: "primary.main",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        },
                      }}
                    >
                      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" } }}>
                        {/* Image */}
                        <Box
                          sx={{
                            width: { xs: "100%", sm: 120 },
                            height: { xs: 180, sm: 120 },
                            position: "relative",
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={item.image?.[0] || "/api/placeholder/120/120"}
                            alt={item.title}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "transform 0.3s ease",
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                          />
                          <Badge
                            badgeContent={item.quantity}
                            color="primary"
                            sx={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              "& .MuiBadge-badge": {
                                fontSize: "0.8rem",
                                fontWeight: "bold",
                              },
                            }}
                          />
                        </Box>

                        {/* Content */}
                        <Box sx={{ flex: 1, p: 2 }}>
                          <Grid container spacing={2} alignItems="center">
                            <Grid item xs={12} sm={6}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {item.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                Unit Price: Rs. {item.price.toLocaleString()}
                              </Typography>
                            </Grid>
                            
                            <Grid item xs={6} sm={3}>
                              <Typography variant="body2" color="text.secondary">
                                Quantity
                              </Typography>
                              <Typography variant="body1" fontWeight="bold">
                                {item.quantity}
                              </Typography>
                            </Grid>
                            
                            <Grid item xs={6} sm={3}>
                              <Typography variant="body2" color="text.secondary">
                                Total
                              </Typography>
                              <Typography variant="h6" color="primary.main" fontWeight="bold">
                                Rs. {(item.price * item.quantity).toLocaleString()}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Box>
                      </Box>
                    </Paper>
                  </Zoom>
                ))
              )}
            </Box>
          </Fade>
        );

      case 1:
        return (
          <Fade in={true}>
            <Box>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <LocationOn color="primary" />
                Shipping Address
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Full Name"
                    name="name"
                    fullWidth
                    value={address.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    InputProps={{
                      startAdornment: <Person sx={{ color: 'action.active', mr: 1 }} />,
                    }}
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    fullWidth
                    value={address.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone"
                    name="phone"
                    fullWidth
                    value={address.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    InputProps={{
                      startAdornment: <Phone sx={{ color: 'action.active', mr: 1 }} />,
                    }}
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="City"
                    name="city"
                    fullWidth
                    value={address.city}
                    onChange={handleChange}
                    error={!!errors.city}
                    helperText={errors.city}
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Full Address"
                    name="address"
                    fullWidth
                    multiline
                    rows={3}
                    value={address.address}
                    onChange={handleChange}
                    error={!!errors.address}
                    helperText={errors.address}
                    InputProps={{
                      startAdornment: <Home sx={{ color: 'action.active', mr: 1, alignSelf: 'flex-start', mt: 1 }} />,
                    }}
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocalShipping color="primary" />
                    Delivery Options
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Paper
                        elevation={0}
                        onClick={() => setDeliveryOption("standard")}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: "2px solid",
                          borderColor: deliveryOption === "standard" ? "primary.main" : "divider",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          bgcolor: deliveryOption === "standard" ? "primary.50" : "background.paper",
                          "&:hover": {
                            borderColor: "primary.main",
                            bgcolor: "primary.50",
                          },
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <Box>
                            <Typography fontWeight="bold">Standard Delivery</Typography>
                            <Typography variant="body2" color="text.secondary">
                              5-7 business days
                            </Typography>
                          </Box>
                          <Typography fontWeight="bold" color="success.main">
                            Free
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Paper
                        elevation={0}
                        onClick={() => setDeliveryOption("express")}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: "2px solid",
                          borderColor: deliveryOption === "express" ? "primary.main" : "divider",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          bgcolor: deliveryOption === "express" ? "primary.50" : "background.paper",
                          "&:hover": {
                            borderColor: "primary.main",
                            bgcolor: "primary.50",
                          },
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <Box>
                            <Typography fontWeight="bold">Express Delivery</Typography>
                            <Typography variant="body2" color="text.secondary">
                              2-3 business days
                            </Typography>
                          </Box>
                          <Typography fontWeight="bold">
                            Rs. 299
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                    {/* Cash on Delivery */}
                    <Grid item xs={12} sm={6}>
                      <Paper
                        elevation={0}
                        onClick={() => setDeliveryOption("COD")}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: "2px solid",
                          borderColor: deliveryOption === "COD" ? "primary.main" : "divider",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          bgcolor: deliveryOption === "COD" ? "primary.50" : "background.paper",
                          "&:hover": {
                            borderColor: "primary.main",
                            bgcolor: "primary.50",
                          },
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <Box>
                            <Typography fontWeight="bold">Cash On Delivery</Typography>
                            <Typography variant="body2" color="text.secondary">
                              7-10 business days
                            </Typography>
                          </Box>
                          <Typography fontWeight="bold">
                            Rs. 350
                          </Typography>
                        </Box>
                      </Paper>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        );

      case 2:
        return (
          <Fade in={true}>
            <Box>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Payment color="primary" />
                Payment Method
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 3,
                  border: "2px solid",
                  borderColor: "primary.main",
                  bgcolor: "primary.50",
                  textAlign: "center",
                }}
              >
                <Lock sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Cash on Delivery
                </Typography>
                <Typography color="text.secondary">
                  Pay with cash when you receive your order
                </Typography>
                <Chip
                  label="Secure & Safe"
                  color="success"
                  size="small"
                  icon={<CheckCircle />}
                  sx={{ mt: 2 }}
                />
              </Paper>

              <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
                <Typography variant="body2">
                  Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our privacy policy.
                </Typography>
              </Alert>
            </Box>
          </Fade>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ 
      bgcolor: "#f8fafc", 
      minHeight: "100vh",
      py: { xs: 2, md: 4 }
    }}>
      <Container maxWidth="lg">
        {/* HEADER */}
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton 
              onClick={() => navigate("/cart")}
              sx={{ 
                bgcolor: "grey.100",
                "&:hover": { bgcolor: "grey.200" }
              }}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant="h5" fontWeight="bold">
              Checkout
            </Typography>
          </Box>
          
          <Chip
            icon={<Lock />}
            label="Secure Checkout"
            color="success"
            variant="outlined"
          />
        </Paper>

        {/* Stepper */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Stepper 
            activeStep={activeStep} 
            alternativeLabel
            sx={{
              "& .MuiStepLabel-root .Mui-completed": {
                color: "success.main",
              },
              "& .MuiStepLabel-label": {
                mt: 1,
                fontWeight: 500,
              },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

        {/* MAIN GRID */}
        <Grid container spacing={3}>
          {/* LEFT SECTION - STEPS */}
          <Grid item xs={12} lg={8}>
            <StyledCard>
              <Box sx={{ p: { xs: 2, sm: 3 } }}>
                {getStepContent(activeStep)}

                {/* Navigation Buttons */}
                <Box sx={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  mt: 4,
                  flexDirection: { xs: "column", sm: "row" },
                  gap: 2
                }}>
                  <Button
                    startIcon={<ArrowBack />}
                    onClick={activeStep === 0 ? () => navigate("/cart") : handleBack}
                    variant="outlined"
                    sx={{ 
                      borderRadius: 2,
                      order: { xs: 2, sm: 1 }
                    }}
                  >
                    {activeStep === 0 ? "Back to Cart" : "Back"}
                  </Button>
                  
                  {activeStep === steps.length - 1 ? (
                    <GradientButton
                      onClick={handleConfirmOrder}
                      sx={{ order: { xs: 1, sm: 2 } }}
                    >
                      Confirm & Pay
                    </GradientButton>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      endIcon={<KeyboardArrowRight />}
                      disabled={cart.length === 0}
                      sx={{ 
                        borderRadius: 2,
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        order: { xs: 1, sm: 2 },
                        "&:hover": {
                          background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                        }
                      }}
                    >
                      Continue
                    </Button>
                  )}
                </Box>
              </Box>
            </StyledCard>
          </Grid>

          {/* RIGHT SECTION - ORDER SUMMARY */}
          <Grid item xs={12} lg={4}>
            <StyledCard sx={{ position: { lg: "sticky" }, top: 20 }}>
              <Box sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Order Summary
                </Typography>

                <Box sx={{ my: 2 }}>
                  <SummaryItem>
                    <Typography color="text.secondary">Subtotal</Typography>
                    <Typography fontWeight="500">Rs. {subtotal.toLocaleString()}</Typography>
                  </SummaryItem>

                  <SummaryItem>
                    <Typography color="text.secondary">Shipping</Typography>
                    <Typography fontWeight="500" color={shippingCost === 0 ? "success.main" : "inherit"}>
                      {shippingCost === 0 ? "Free" : `Rs. ${shippingCost}`}
                    </Typography>
                  </SummaryItem>

                  {promoApplied && (
                    <SummaryItem>
                      <Typography color="text.secondary">Discount (10%)</Typography>
                      <Typography fontWeight="500" color="error.main">
                        -Rs. {discount.toLocaleString()}
                      </Typography>
                    </SummaryItem>
                  )}
                </Box>

                {/* Promo Code */}
                <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                  <TextField
                    size="small"
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={promoApplied}
                    sx={{ flex: 1 }}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleApplyPromo}
                    disabled={promoApplied || !promoCode}
                    startIcon={<Discount />}
                    sx={{ borderRadius: 2 }}
                  >
                    Apply
                  </Button>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold">
                    Total
                  </Typography>
                  <Typography variant="h5" fontWeight="bold" color="primary.main">
                    Rs. {total.toLocaleString()}
                  </Typography>
                </Box>

                {/* Item Count */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <ShoppingBag color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {cart.length} {cart.length === 1 ? "item" : "items"} in cart
                  </Typography>
                </Box>

                {/* Trust Badges */}
                <Grid container spacing={1}>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: "center" }}>
                      <Lock sx={{ fontSize: 28, color: "text.secondary", mb: 0.5 }} />
                      <Typography variant="caption" display="block" color="text.secondary">
                        Secure
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: "center" }}>
                      <LocalShipping sx={{ fontSize: 28, color: "text.secondary", mb: 0.5 }} />
                      <Typography variant="caption" display="block" color="text.secondary">
                        Free Shipping
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box sx={{ textAlign: "center" }}>
                      <Payment sx={{ fontSize: 28, color: "text.secondary", mb: 0.5 }} />
                      <Typography variant="caption" display="block" color="text.secondary">
                        COD Available
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </StyledCard>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CheckoutPage;