import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Stack
} from "@mui/material";
import { fetchLoginUserProducts } from "../services/productServices";

const MyProductsPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    const { result } = await fetchLoginUserProducts();
    setProducts(result || []);
  };

  return (
    <Box sx={{ p: 3 }}>
      
      {/* Title */}
      <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold" }}>
        My Products
      </Typography>

      {/* Grid */}
      <Grid container spacing={3}>
        {products?.map((product, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            
            <Card
              sx={{
                borderRadius: 3,
                display: "flex",
                flexDirection: "column",
                height: "100%",
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: 6,
                },
              }}
            >
              {/* ✅ Fixed Image Container */}
              <Box
                sx={{
                  height: 180,
                  width: "100%",
                  overflow: "hidden",
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                  bgcolor: "#f5f5f5",
                }}
              >
                <Box
                  component="img"
                  src={
                    product?.image?.[0] ||
                    "https://via.placeholder.com/300"
                  }
                  alt={product.title}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover", // 🔥 FIXED
                    transition: "0.3s",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                />
              </Box>

              {/* Content */}
              <CardContent sx={{ flexGrow: 1 }}>
                
                {/* Title */}
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {product.title}
                </Typography>

                {/* Price */}
                <Typography
                  color="primary"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  Rs. {product.price}
                </Typography>

                {/* Categories */}
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mb: 1, flexWrap: "wrap" }}
                >
                  {product.categories?.map((cat, i) => (
                    <Chip key={i} label={cat} size="small" />
                  ))}
                </Stack>

                {/* Quantity */}
                <Typography variant="body2" color="text.secondary">
                  Stock: {product.quantity}
                </Typography>

                {/* Actions */}
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Button variant="outlined" size="small" fullWidth>
                    Edit
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    fullWidth
                  >
                    Delete
                  </Button>
                </Stack>

              </CardContent>
            </Card>

          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MyProductsPage;