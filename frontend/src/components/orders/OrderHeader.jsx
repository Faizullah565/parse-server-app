import React from "react";
import {
  Box,
  Grid,
  Stack,
  Typography,
  Chip,
  useTheme,
  alpha
} from "@mui/material";
import {
  Receipt,
  CalendarToday
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import StatusChip from "./StatusChip";

const OrderHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.light, 0.1)} 100%)`,
  padding: theme.spacing(2),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const OrderHeaderComponent = ({ order, isMobile }) => {
  const theme = useTheme();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-PK", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <OrderHeader>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6}>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <Chip
              icon={<Receipt />}
              label={`#${order.orderId || order.orderNumber || order.objectId.slice(-8)}`}
              variant="outlined"
              size={isMobile ? "small" : "medium"}
              sx={{ borderRadius: 2 }}
            />
            <Stack direction="row" spacing={1} alignItems="center">
              <CalendarToday sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="body2" color="text.secondary">
                {formatDate(order.createdAt)}
              </Typography>
            </Stack>
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
            <StatusChip status={order.status} />
            <Typography
              variant="h6"
              fontWeight="bold"
              color="primary.main"
              sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
            >
              Rs. {(order.total || order.totalAmount || 0).toLocaleString()}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </OrderHeader>
  );
};

export default OrderHeaderComponent;