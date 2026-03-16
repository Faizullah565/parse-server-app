// src/pages/ProductDetails.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  IconButton,
  Chip,
  Rating,
  Divider,
  Paper,
  TextField,
  Breadcrumbs,
  Link,
  Alert,
  Skeleton,
  Tab,
  Tabs,
  Card,
  CardMedia,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Tooltip
} from "@mui/material";
import {
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  LocalShipping as ShippingIcon,
  Security as SecurityIcon,
  AssignmentReturn as ReturnIcon,
  Verified as VerifiedIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  WhatsApp as WhatsAppIcon
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import api from "../services/api";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
}));

const ThumbnailImage = styled('img')(({ theme, active }) => ({
  width: 80,
  height: 80,
  objectFit: 'cover',
  borderRadius: theme.spacing(1),
  cursor: 'pointer',
  border: active ? `3px solid ${theme.palette.primary.main}` : '2px solid transparent',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    borderColor: theme.palette.primary.main,
  },
}));

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
      
      // Fetch related products
      const relatedResponse = await api.get(`/products/category/${response.data.categories}`);
      setRelatedProducts(relatedResponse.data.filter(p => p.id !== response.data.id).slice(0, 4));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch product details");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, Math.min(prev + delta, product?.quantity || 1)));
  };

  const handleAddToCart = async () => {
    try {
      await api.post("/cart/add", {
        productId: product.id,
        quantity: quantity
      });
      // Show success message
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" height={60} />
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" height={40} sx={{ mt: 2 }} />
            <Skeleton variant="text" height={100} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/" color="inherit">
          Home
        </Link>
        <Link component={RouterLink} to="/products" color="inherit">
          Products
        </Link>
        <Typography color="text.primary">{product?.title}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Box sx={{ position: 'relative' }}>
              <img
                src={product?.images?.[selectedImage] || product?.image || "https://via.placeholder.com/600x400"}
                alt={product?.title}
                style={{
                  width: '100%',
                  height: 400,
                  objectFit: 'cover',
                  borderRadius: 8,
                  marginBottom: 16
                }}
              />
              <Tooltip title={isFavorite ? "Remove from wishlist" : "Add to wishlist"}>
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    bgcolor: 'white',
                    '&:hover': { bgcolor: 'grey.100' }
                  }}
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                </IconButton>
              </Tooltip>
            </Box>

            {/* Thumbnails */}
            {product?.images && product.images.length > 1 && (
              <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                {product.images.map((img, index) => (
                  <ThumbnailImage
                    key={index}
                    src={img}
                    alt={`${product.title} ${index + 1}`}
                    active={selectedImage === index}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </Box>
            )}
          </StyledPaper>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <StyledPaper>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {product?.title}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Chip label={product?.categories} color="primary" />
              {product?.quantity > 0 ? (
                <Chip 
                  icon={<VerifiedIcon />} 
                  label="In Stock" 
                  color="success" 
                  variant="outlined" 
                />
              ) : (
                <Chip label="Out of Stock" color="error" variant="outlined" />
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Rating value={product?.rating || 4} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary">
                ({product?.reviews || 0} reviews)
              </Typography>
            </Box>

            <Typography variant="h3" color="primary" sx={{ fontWeight: 700, mb: 3 }}>
              ${product?.price?.toFixed(2)}
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              {product?.description || "No description available."}
            </Typography>

            {/* Quantity Selector */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Quantity:
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton 
                  size="small" 
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <RemoveIcon />
                </IconButton>
                <TextField
                  value={quantity}
                  size="small"
                  sx={{ width: 60, mx: 1 }}
                  inputProps={{ min: 1, max: product?.quantity, style: { textAlign: 'center' } }}
                  onChange={(e) => setQuantity(Math.min(product?.quantity, Math.max(1, Number(e.target.value))))}
                />
                <IconButton 
                  size="small" 
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product?.quantity}
                >
                  <AddIcon />
                </IconButton>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {product?.quantity} available
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<CartIcon />}
                onClick={handleAddToCart}
                disabled={product?.quantity === 0}
              >
                Add to Cart
              </Button>
              <Button
                variant="outlined"
                size="large"
                startIcon={<ShareIcon />}
              >
                Share
              </Button>
            </Box>

            {/* Features */}
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <ShippingIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="body2">Free Shipping</Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <SecurityIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="body2">Secure Payment</Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <ReturnIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="body2">30-Day Returns</Typography>
                </Box>
              </Grid>
            </Grid>
          </StyledPaper>
        </Grid>

        {/* Product Details Tabs */}
        <Grid item xs={12}>
          <StyledPaper>
            <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
              <Tab label="Description" />
              <Tab label="Specifications" />
              <Tab label="Reviews" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <Typography variant="body1">
                {product?.description || "No description available."}
              </Typography>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Category" 
                    secondary={product?.categories}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Price" 
                    secondary={`$${product?.price?.toFixed(2)}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Quantity Available" 
                    secondary={product?.quantity}
                  />
                </ListItem>
              </List>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Typography variant="body1" color="text.secondary" align="center">
                No reviews yet. Be the first to review this product!
              </Typography>
            </TabPanel>
          </StyledPaper>
        </Grid>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
              Related Products
            </Typography>
            <Grid container spacing={3}>
              {relatedProducts.map((related) => (
                <Grid item xs={12} sm={6} md={3} key={related.id}>
                  <Card 
                    component={RouterLink}
                    to={`/product/${related.id}`}
                    sx={{ 
                      textDecoration: 'none',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': { transform: 'scale(1.05)' }
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="160"
                      image={related.image || "https://via.placeholder.com/300x160"}
                      alt={related.title}
                    />
                    <CardContent>
                      <Typography variant="subtitle1" noWrap>
                        {related.title}
                      </Typography>
                      <Typography variant="h6" color="primary">
                        ${related.price?.toFixed(2)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default ProductDetails;