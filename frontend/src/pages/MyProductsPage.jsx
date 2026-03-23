import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Divider,
    CircularProgress,
    Alert,
    IconButton,
    useTheme,
    alpha,
    Stack,
    Paper
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PaymentIcon from "@mui/icons-material/Payment";
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

const PARSE_SERVER_URL = import.meta.env.VITE_PARSE_SERVER_URL;
const APP_ID = import.meta.env.VITE_PARSE_APP_ID;

// Reusable axios instance for Parse Server
const parseAxios = axios.create({
    baseURL: PARSE_SERVER_URL,
    headers: {
        "X-Parse-Application-Id": APP_ID,
        "Content-Type": "application/json",
    },
});

// Attach session token dynamically
parseAxios.interceptors.request.use((config) => {
    const sessionToken = localStorage.getItem("sessionToken");
    if (sessionToken) {
        config.headers["X-Parse-Session-Token"] = sessionToken;
    }
    return config;
});

// Initialize Stripe with public key
const stripePromise = loadStripe(import.meta.env.VITE_REACT_STRIPE_KEY);

// ------------------- Payment Form Component -------------------
const PaymentForm = ({ order, onSuccess, onError, onClose }) => {
    const stripe = useStripe();
    const elements = useElements();
    const theme = useTheme();
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [clientSecret, setClientSecret] = useState(null);
    const [loadingIntent, setLoadingIntent] = useState(true);
    const [amount, setAmount] = useState(0);

    // Create payment intent when modal opens
    useEffect(() => {
        const createPaymentIntent = async () => {
            try {
                setLoadingIntent(true);
                setError(null);

                if (!order?.objectId) {
                    throw new Error("Invalid order ID");
                }

                // Call Parse Cloud function
                const response = await parseAxios.post("/functions/createPaymentIntent", {
                    orderId: order.objectId
                });

                const result = response?.data?.result;

                if (!result?.clientSecret) {
                    throw new Error("Failed to get client secret from server");
                }

                setClientSecret(result.clientSecret);
                setAmount(result.amount || 0);

            } catch (err) {
                console.error("Payment intent error:", err);
                let errorMessage = "Unable to initialize payment. ";
                if (err.response) {
                    errorMessage += err.response.data?.error || err.response.data?.message || "Server error";
                } else if (err.request) {
                    errorMessage += "Network error. Please check your connection.";
                } else {
                    errorMessage += err.message || "Please try again.";
                }
                setError(errorMessage);
                onError?.(err);
            } finally {
                setLoadingIntent(false);
            }
        };

        if (order) {
            createPaymentIntent();
        }
    }, [order, onError]);

    // Handle form submit
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            setError("Stripe is not initialized. Please refresh the page.");
            return;
        }

        if (!clientSecret) {
            setError("Payment not initialized. Please try again.");
            return;
        }

        setProcessing(true);
        setError(null);

        try {
            const cardElement = elements.getElement(CardElement);
            if (!cardElement) throw new Error("Card element not found");

            // Confirm card payment
            const { error: submitError, paymentIntent } = await stripe.confirmCardPayment(
                clientSecret,
                {
                    payment_method: {
                        card: cardElement,
                        billing_details: {
                            name: order.customerName || "Customer",
                            email: order.customerEmail || "",
                        },
                    },
                }
            );

            if (submitError) throw new Error(submitError.message);

            if (paymentIntent?.status === "succeeded") {
                // Verify payment via backend
                const verifyResponse = await parseAxios.post("/functions/verifyPayment", {
                    paymentIntentId: paymentIntent.id
                });

                const result = verifyResponse?.data?.result;

                if (result?.success) {
                    onSuccess(paymentIntent);
                } else {
                    throw new Error(result?.message || "Payment verification failed");
                }
            } else {
                throw new Error("Payment was not successful");
            }

        } catch (err) {
            console.error("Payment failed:", err);
            setError(err.message || "Payment failed. Please try again.");
            onError?.(err);
        } finally {
            setProcessing(false);
        }
    };

    const cardElementOptions = {
        style: {
            base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": { color: "#aab7c4" },
                padding: "10px 12px",
                fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            },
            invalid: {
                color: "#9e2146",
                iconColor: "#9e2146",
            },
        },
        hidePostalCode: true,
    };

    if (loadingIntent) {
        return (
            <Box sx={{ textAlign: "center", py: 4 }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Initializing payment...</Typography>
            </Box>
        );
    }

    return (
        <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                    Card Details
                </Typography>
                <Paper
                    variant="outlined"
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        borderColor: error ? theme.palette.error.main : alpha(theme.palette.primary.main, 0.2),
                        "&:focus-within": {
                            borderColor: theme.palette.primary.main,
                            boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
                        },
                    }}
                >
                    <CardElement options={cardElementOptions} />
                </Paper>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <DialogActions sx={{ px: 0, pb: 0 }}>
                <Button onClick={onClose} disabled={processing}>Cancel</Button>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={!stripe || !clientSecret || processing}
                    sx={{ minWidth: 120, position: "relative" }}
                >
                    {processing
                        ? <>
                            <CircularProgress size={24} sx={{ position: "absolute" }} />
                            Processing...
                          </>
                        : `Pay Rs. ${amount.toLocaleString()}`
                    }
                </Button>
            </DialogActions>
        </form>
    );
};

// ------------------- Payment Modal -------------------
const PaymentModal = ({ open, onClose, order, onSuccess, onError }) => {
    const theme = useTheme();
    if (!order) return null;

    const amount = order?.total || order?.totalAmount || 0;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: { borderRadius: 3, overflow: "hidden" } }}
        >
            <DialogTitle
                sx={{
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.light, 0.1)} 100%)`,
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box display="flex" alignItems="center" gap={1}>
                        <PaymentIcon color="primary" />
                        <Typography variant="h6" fontWeight="bold">Complete Payment</Typography>
                    </Box>
                    <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ pt: 3 }}>
                {/* Order Summary */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 2,
                        mb: 3,
                        bgcolor: alpha(theme.palette.primary.main, 0.02),
                        borderRadius: 2,
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    }}
                >
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Order Summary
                    </Typography>
                    <Stack spacing={1}>
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                                Order #{order.orderId || order.orderNumber || order.objectId?.slice(-8)}
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                                {order.items?.length || 0} items
                            </Typography>
                        </Box>
                        <Divider />
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="body1" fontWeight="bold">Total Amount</Typography>
                            <Typography variant="h6" fontWeight="bold" color="primary.main">
                                Rs. {amount.toLocaleString()}
                            </Typography>
                        </Box>
                    </Stack>
                </Paper>

                {/* Payment Form */}
                <Elements stripe={stripePromise}>
                    <PaymentForm
                        order={order}
                        onSuccess={onSuccess}
                        onError={onError}
                        onClose={onClose}
                    />
                </Elements>

                {/* Security Note */}
                <Box sx={{ mt: 3, pt: 2, borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`, textAlign: "center" }}>
                    <Typography variant="caption" color="text.secondary" display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                        <CreditCardIcon sx={{ fontSize: 14 }} /> Secure payment powered by Stripe
                    </Typography>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default PaymentModal;