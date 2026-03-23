import React from "react";
import {
  Box,
  Typography,
  Paper,
  Fade,
  useTheme,
  alpha
} from "@mui/material";
import { ShoppingBag } from "@mui/icons-material";
import { styled } from "@mui/system";

const EmptyStateBox = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  textAlign: "center",
  borderRadius: 24,
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
  border: `2px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
}));

const EmptyState = () => {
  const theme = useTheme();

  return (
    <Fade in={true} timeout={1000}>
      <EmptyStateBox>
        <ShoppingBag
          sx={{
            fontSize: { xs: 60, md: 80 },
            color: alpha(theme.palette.primary.main, 0.3),
            mb: 2,
          }}
        />
        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
          sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}
        >
          No Orders Yet
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Looks like you haven't placed any orders yet.
        </Typography>
      </EmptyStateBox>
    </Fade>
  );
};

export default EmptyState;