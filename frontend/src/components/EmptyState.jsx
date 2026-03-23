import React from "react";
import { Box, Typography } from "@mui/material";

const EmptyState = () => {
  return (
    <Box textAlign="center" mt={10}>
      <Typography variant="h6" color="text.secondary">
        No products found 😔
      </Typography>
    </Box>
  );
};

export default EmptyState;