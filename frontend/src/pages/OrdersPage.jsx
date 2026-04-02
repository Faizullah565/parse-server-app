import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  CircularProgress,
  Fade,
  useTheme,
  useMediaQuery,
  alpha
} from "@mui/material";
import { getUserOrders } from "../services/orderService";
import PageHeader from "../components/orders/PageHeader";
import EmptyState from "../components/orders/EmptyState";
import OrderCard from "../components/orders/OrderCard";
import { useOrders } from "../context/OrderContext";
import { fetchLoginUserProducts } from "../services/productServices";

const OrdersPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  const { orders, loading } = useOrders();
  const [expandedOrder, setExpandedOrder] = useState(null);

  fetchLoginUserProducts()

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, #ffffff 100%)`,
        minHeight: "100vh",
        py: { xs: 2, sm: 4, md: 5 },
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      <Container maxWidth="lg" disableGutters={isMobile}>
        <PageHeader />
        
        {orders.length === 0 ? (
          <EmptyState />
        ) : (
          orders?.map((order, index) => (
            <OrderCard
              key={order.objectId}
              order={order}
              index={index}
              expandedOrder={expandedOrder}
              onToggleExpand={toggleExpand}
            />
          ))
        )}
      </Container>
    </Box>
  );
};

export default OrdersPage;