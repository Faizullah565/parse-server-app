import React from "react";
import { Box, Typography } from "@mui/material";

const PageHeader = ({ title }) => {
  return (
    <Box mb={3}>
      <Typography variant="h4" fontWeight="bold">
        
        {title}
      </Typography>
    </Box>
  );
};

export default PageHeader;