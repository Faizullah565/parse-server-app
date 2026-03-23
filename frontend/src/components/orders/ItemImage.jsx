import React from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledItemImage = styled(Box)(({ theme }) => ({
  width: 80,
  height: 80,
  borderRadius: 16,
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  border: `2px solid ${theme.palette.background.paper}`,
  transition: "transform 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
  },
  [theme.breakpoints.down("sm")]: {
    width: 60,
    height: 60,
    borderRadius: 12,
  },
}));

const ItemImage = ({ src, alt }) => {
  return (
    <StyledItemImage>
      <img
        src={src || "/api/placeholder/80/80"}
        alt={alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </StyledItemImage>
  );
};

export default ItemImage;