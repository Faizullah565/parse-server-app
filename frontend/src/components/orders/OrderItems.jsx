import React from "react";
import {
  Box,
  Grid,
  Typography,
  Stack,
  Paper,
  Divider,
  Fade,
  useTheme,
  useMediaQuery,
  alpha
} from "@mui/material";
import ItemImage from "./ItemImage";

const OrderItems = ({ items }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ mt: 3 }}>
      {items.map((item, idx) => (
        <Fade in={true} style={{ transitionDelay: `${idx * 50}ms` }} key={idx}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 1.5, sm: 2 },
              mb: 2,
              borderRadius: 3,
              background: alpha(theme.palette.primary.main, 0.02),
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              transition: "all 0.2s ease",
              "&:hover": {
                background: alpha(theme.palette.primary.main, 0.05),
                borderColor: alpha(theme.palette.primary.main, 0.2),
              },
            }}
          >
            <Grid container spacing={2} alignItems="center">
              {/* Image */}
              <Grid item xs={3} sm={2}>
                <ItemImage src={item.image?.[0]} alt={item.title} />
              </Grid>

              {/* Info */}
              <Grid item xs={6} sm={6}>
                <Typography
                  fontWeight="bold"
                  sx={{
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    lineHeight: 1.3,
                  }}
                >
                  {item.title}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" } }}
                  >
                    Rs. {(item.price || 0).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ×
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    color="primary.main"
                  >
                    {item.quantity || 1}
                  </Typography>
                </Stack>
              </Grid>

              {/* Total */}
              <Grid item xs={3} sm={2}>
                <Box sx={{ textAlign: "right" }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ display: { xs: "block", sm: "none" } }}
                  >
                    Total
                  </Typography>
                  <Typography
                    fontWeight="bold"
                    color="primary.main"
                    sx={{
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                    }}
                  >
                    Rs. {((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                  </Typography>
                </Box>
              </Grid>

              {/* Expand/Collapse Indicator for mobile */}
              {isMobile && idx === 0 && (
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
              )}
            </Grid>
          </Paper>
        </Fade>
      ))}
    </Box>
  );
};

export default OrderItems;