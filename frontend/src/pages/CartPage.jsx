import React, { useState, useEffect } from "react";
import {
    Container,
    Paper,
    Typography,
    Box,
    IconButton,
    Button,
    TextField,
    Divider,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Alert,
    Snackbar,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from "@mui/material";
import {
    Add as AddIcon,
    Remove as RemoveIcon,
    Delete as DeleteIcon,
    ShoppingBag as ShoppingBagIcon,
    ArrowBack as ArrowBackIcon,
    Close as CloseIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    clearCart,
    deleteCartItem,
    fetchUserCarts,
    updateCartItemQuantity
} from "../services/cartService";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { saveUserCart } from "../../utils/storedData";

const CartPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success"
    });
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [itemToRemove, setItemToRemove] = useState(null);

    //   ======== STATE VARIABLES ==========
    const {
        // cart,
        setCart,
        updateCartItemQuantityState,
        removeFromCart,
        clearCartState,
    } = useCart()
    const { cart } = useCart()// || []
    const {user, sessionToken} = useAuth()

    // Fetch cart items on mount
    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            setLoading(true);
            const response = await fetchUserCarts()
            
            Array.isArray(response?.result) && response.result.length > 0
                ? setCart(response.result)
                : setCart([]);
            Array.isArray(response?.result) && response.result.length > 0
                ? saveUserCart("save-cart", response.result)
                : saveUserCart("save-cart", []);
        } catch (error) {
            console.error("Error fetching cart:", error);
            showNotification("Failed to load cart items", "error");
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (cartItemId, newQuantity) => {
        if (newQuantity < 1) return;

        try {
            setUpdating(true);
            const response = await updateCartItemQuantity(cartItemId, newQuantity)

            // Update local context state
            updateCartItemQuantityState(cartItemId, newQuantity)

        } catch (error) {
            console.error("Error updating quantity:", error);
            showNotification("Failed to update quantity", "error");
        } finally {
            setUpdating(false);
        }
    };

    const removeItemFromCart = async (cartItemId) => {
        try {
            setUpdating(true);
            const response = await deleteCartItem(cartItemId);
            // Remove from local state
            removeFromCart(cartItemId);

            showNotification(response.result?.message || "Item removed from cart", "success");
            setOpenConfirmDialog(false);
            setItemToRemove(null);

        } catch (error) {
            console.error("Error removing item:", error);
            showNotification("Failed to remove item", "error");
        } finally {
            setUpdating(false);
        }
    };

    const handleRemoveClick = (item) => {
        setItemToRemove(item);
        setOpenConfirmDialog(true);
    };

    const clearCartfunction = async () => {
        try {
            setUpdating(true);
            const response = await clearCart()
            clearCartState()
            showNotification("Cart cleared successfully", "success");

        } catch (error) {
            console.error("Error clearing cart:", error);
            showNotification("Failed to clear cart", "error");
        } finally {
            setUpdating(false);
        }
    };

    const showNotification = (message, severity) => {
        setNotification({
            open: true,
            message,
            severity
        });
    };

    const handleCloseNotification = () => {
        setNotification(prev => ({ ...prev, open: false }));
    };

    // Calculate totals
    const calculateSubtotal = () => {
        return cart?.reduce((total, item) => {
            const price = item?.price || 0;
            return total + price * item.quantity;
        }, 0);
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const shipping = subtotal > 0 ? 5.99 : 0; // Example shipping
        return subtotal + shipping;
    };

    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={() => navigate(-1)}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4" sx={{ fontWeight: 600 }}>
                        Shopping Cart
                    </Typography>
                </Box>
                {cart?.length > 0 && (
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={clearCartfunction}
                        disabled={updating}
                    >
                        Clear Cart
                    </Button>
                )}
            </Box>

            {cart?.length === 0 ? (
                // Empty Cart
                <Paper
                    sx={{
                        p: 6,
                        textAlign: 'center',
                        borderRadius: 2,
                        bgcolor: 'background.paper'
                    }}
                >
                    <ShoppingBagIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h5" gutterBottom>
                        Your cart is empty
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Looks like you haven't added any items to your cart yet.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={() => navigate('/products')}
                    >
                        Continue Shopping
                    </Button>
                </Paper>
            ) : (
                // Cart with items
                <Grid container spacing={3} justifyContent={"space-between"}>
                    {/* Cart Items */}
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 2, borderRadius: 2 }}>
                            {cart?.map((item, index) => (
                                <Box key={item.objectId}>
                                    <Card variant="outlined" sx={{ display: 'flex', mb: index !== cart.length - 1 ? 2 : 0 }}>
                                        {/* Product Image */}
                                        <CardMedia
                                            component="img"
                                            sx={{ width: 120, height: 120, objectFit: 'cover' }}
                                            image={item?.image || '/placeholder.jpg'}
                                            alt={item?.title}
                                        />

                                        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                            <CardContent sx={{ flex: '1 0 auto', pb: 1 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                    <Box>
                                                        <Typography variant="h6" component="div">
                                                            {item?.title}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            ${item?.price?.toFixed(2)} each
                                                        </Typography>
                                                    </Box>
                                                    <IconButton
                                                        onClick={() => handleRemoveClick(item)}
                                                        color="error"
                                                        size="small"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Box>
                                            </CardContent>

                                            <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                                                {/* Quantity Controls */}
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => updateQuantity(item.objectId, item.quantity - 1)}
                                                        disabled={item.quantity <= 1 || updating}
                                                    >
                                                        <RemoveIcon />
                                                    </IconButton>

                                                    <TextField
                                                        size="small"
                                                        value={item.quantity}
                                                        onChange={(e) => {
                                                            const val = parseInt(e.target.value);
                                                            if (!isNaN(val) && val > 0) {
                                                                updateQuantity(item.objectId, val);
                                                            }
                                                        }}
                                                        inputProps={{
                                                            min: 1,
                                                            style: { textAlign: 'center', width: '50px' }
                                                        }}
                                                        disabled={updating}
                                                    />

                                                    <IconButton
                                                        size="small"
                                                        onClick={() => updateQuantity(item.objectId, item.quantity + 1)}
                                                        disabled={updating}
                                                    >
                                                        <AddIcon />
                                                    </IconButton>
                                                </Box>

                                                {/* Item Total */}
                                                <Typography variant="h6" color="primary">
                                                    ${(item?.price * item.quantity)?.toFixed(2)}
                                                </Typography>
                                            </CardActions>
                                        </Box>
                                    </Card>
                                </Box>
                            ))}
                        </Paper>
                    </Grid>

                    {/* Order Summary */}
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, borderRadius: 2, position: 'sticky', top: 20 }}>
                            <Typography variant="h6" gutterBottom>
                                Order Summary
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body1">Subtotal</Typography>
                                <Typography variant="body1">${calculateSubtotal()?.toFixed(2)}</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body1">Shipping</Typography>
                                <Typography variant="body1">
                                    {calculateSubtotal() > 0 ? '$5.99' : '$0.00'}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body1">Tax</Typography>
                                <Typography variant="body1">$0.00</Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                <Typography variant="h6">Total</Typography>
                                <Typography variant="h6" color="primary">
                                    ${calculateTotal().toFixed(2)}
                                </Typography>
                            </Box>

                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                size="large"
                                onClick={() => navigate('/checkout')}
                                disabled={cart?.length === 0 || updating}
                            >
                                Proceed to Checkout
                            </Button>

                            <Button
                                variant="text"
                                fullWidth
                                sx={{ mt: 1 }}
                                onClick={() => navigate('/products')}
                            >
                                Continue Shopping
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            )}

            {/* Remove Item Confirmation Dialog */}
            <Dialog
                open={openConfirmDialog}
                onClose={() => setOpenConfirmDialog(false)}
            >
                <DialogTitle>Remove Item</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to remove "{itemToRemove?.product?.title}" from your cart?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirmDialog(false)}>Cancel</Button>
                    <Button
                        onClick={() => removeItemFromCart(itemToRemove?.objectId)}
                        color="error"
                        variant="contained"
                    >
                        Remove
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Notification Snackbar */}
            <Snackbar
                open={notification.open}
                autoHideDuration={3000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseNotification}
                    severity={notification.severity}
                    variant="filled"
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default CartPage;