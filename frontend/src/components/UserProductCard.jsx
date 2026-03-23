import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { deleteLoginUserProduct } from "../services/productServices";
import { toast } from "react-toastify";

const UserProductCard = ({ product, onEdit, setProducts }) => {

    const handleDelete = async (product) => {
  const confirm = window.confirm("Delete this product?");
  if (!confirm) return;

  try {
    const res = await deleteLoginUserProduct(product.objectId)
    console.log("🚀 ~ handleDelete ~ res:", res)
    //  remove from UI
    toast.success(res?.result?.message)
    setProducts((prev) =>
      prev.filter((p) => p.objectId !== product.objectId)
    );

  } catch (err) {
    console.log(err);
  }
};
  return (
    <Card
      sx={{
        borderRadius: "18px",
        overflow: "hidden",
        position: "relative",
        transition: "0.4s",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-8px) scale(1.02)",
          boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
        },
      }}
    >
      {/*  Image */}
      <Box
        sx={{
          height: 150,
        //   width:140,
          backgroundImage: `url(${product.image?.[0]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        {/* Overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
          }}
        />

        {/* Actions */}
        <Box
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            display: "flex",
            gap: 1,
          }}
        >
          <Tooltip title="Edit">
            <IconButton
              size="small"
              sx={{
                background: "rgba(255,255,255,0.8)",
                "&:hover": { background: "#fff" },
              }}
              onClick={(e) => {
                e.stopPropagation();
                onEdit(product);
              }}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton
              size="small"
              sx={{
                background: "rgba(255,255,255,0.8)",
                "&:hover": { background: "#ffebee" },
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(product);
              }}
            >
              <Delete fontSize="small" color="error" />
            </IconButton>
          </Tooltip>
        </Box>

        {/*  Title over image */}
        <Box
          sx={{
            position: "absolute",
            bottom: 10,
            left: 15,
            color: "#fff",
          }}
        >
          <Typography fontWeight="bold" fontSize="16px">
            {product.title}
          </Typography>
        </Box>
      </Box>

      {/* Content */}
      <CardContent>
        <Typography color="text.secondary" sx={{ mb: 1 }}>
          {product.categories?.[0]}
        </Typography>

        <Typography
          fontWeight="bold"
          sx={{
            fontSize: "18px",
            background: "linear-gradient(90deg, #00c6ff, #0072ff)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Rs. {product.price}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default UserProductCard;