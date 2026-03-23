import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Fade,
  useTheme,
  alpha
} from "@mui/material";
import { LocalShipping } from "@mui/icons-material";

const PageHeader = () => {
  const theme = useTheme();

  return (
    <Fade in={true} timeout={800}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: { xs: 3, md: 4 },
          flexWrap: "wrap",
        }}
      >
        <Avatar
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: "primary.main",
            width: { xs: 48, md: 60 },
            height: { xs: 48, md: 60 },
          }}
        >
          <LocalShipping sx={{ fontSize: { xs: 24, md: 32 } }} />
        </Avatar>
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              fontSize: { xs: "1.75rem", sm: "2rem", md: "2.25rem" },
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            My Orders
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Track and manage your orders
          </Typography>
        </Box>
      </Box>
    </Fade>
  );
};

export default PageHeader;