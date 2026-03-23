import React from "react";
import {
  Card,
  CardContent,
  Zoom,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import OrderHeader from "./OrderHeader";
import OrderItems from "./OrderItems";
import OrderFooter from "./OrderFooter";

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: 20,
  marginBottom: theme.spacing(3),
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  transition: "all 0.3s ease-in-out",
  overflow: "hidden",
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
  },
}));

const OrderCard = ({ order, index, expandedOrder, onToggleExpand }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Zoom
      in={true}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <StyledCard>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <OrderHeader order={order} isMobile={isMobile} />
          <OrderItems items={order.items || []} />
          <OrderFooter 
            order={order} 
            isMobile={isMobile}
            showPayButton={order.paymentStatus === "unpaid" || order.status === "pending"}
          />
        </CardContent>
      </StyledCard>
    </Zoom>
  );
};

export default OrderCard;