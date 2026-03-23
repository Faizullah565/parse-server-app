import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Stack,
  Chip,
  Button,
  useTheme,
  alpha
} from "@mui/material";
import { LocalShipping } from "@mui/icons-material";
import PaymentModal from "./PymentModal";

const OrderFooter = ({ order, isMobile, showPayButton, onPaymentSuccess }) => {
  const theme = useTheme();
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const handlePayNow = () => {
    setPaymentModalOpen(true);
  };

  const handlePaymentSuccess = (paymentIntent) => {
    console.log("Payment successful:", paymentIntent);
    setPaymentModalOpen(false);
    // Call the parent callback if provided
    if (onPaymentSuccess) {
      onPaymentSuccess(order.objectId, paymentIntent);
    }
  };

  const handlePaymentError = (error) => {
    console.error("Payment error:", error);
    // You can show an error toast/notification here
  };

  return (
    <>
      <Box
        sx={{
          mt: 3,
          pt: 2,
          borderTop: `2px dashed ${alpha(theme.palette.divider, 0.5)}`,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
              <Chip
                size="small"
                label={`${order.items?.length || 0} items`}
                variant="outlined"
                sx={{ borderRadius: 2 }}
              />
              {order.trackingNumber && (
                <Chip
                  size="small"
                  icon={<LocalShipping />}
                  label={`Track: ${order.trackingNumber}`}
                  variant="outlined"
                  color="primary"
                  sx={{ borderRadius: 2 }}
                />
              )}
            </Stack>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "flex-start", sm: "flex-end" },
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Total Amount:
              </Typography>
              <Typography
                variant="h6"
                fontWeight="bold"
                color="primary.main"
                sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
              >
                Rs. {(order.total || order.totalAmount || 0).toLocaleString()}
              </Typography>
              
              {/* Pay Now Button - Only shown if unpaid */}
              {showPayButton && (
                <Button
                  variant="contained"
                  color="primary"
                  size={isMobile ? "small" : "medium"}
                  onClick={handlePayNow}
                  sx={{
                    ml: { xs: 0, sm: 2 },
                    borderRadius: 8,
                    px: 3,
                    fontWeight: "bold",
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                    "&:hover": {
                      boxShadow: `0 6px 16px ${alpha(theme.palette.primary.main, 0.4)}`,
                    }
                  }}
                >
                  Pay Now
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Payment Modal */}
      <PaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        order={order}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </>
  );
};

export default OrderFooter;