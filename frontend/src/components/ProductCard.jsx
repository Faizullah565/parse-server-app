// src/pages/Products.jsx
import React, { useState } from "react";
import {
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Chip,
  Box,
} from "@mui/material";
import {
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import "../styles/ProductCard.css"

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[12],
    '& .quick-view-btn': {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
}));

const FavoriteButton = styled(IconButton)(({ theme, isfavorite }) => ({
  position: 'absolute',
  top: 8,
  right: 8,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  color: isfavorite === 'true' ? theme.palette.error.main : theme.palette.grey[500],
  '&:hover': {
    backgroundColor: 'white',
    transform: 'scale(1.1)',
  },
  transition: 'all 0.2s ease',
}));

const QuickViewButton = styled(Button)({
  position: 'absolute',
  bottom: 80,
  left: '50%',
  transform: 'translateX(-50%) translateY(20px)',
  opacity: 0,
  transition: 'all 0.3s ease',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  color: 'white',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
  },
});

const ProductCard = ({ product }) => {
      const [favorites, setFavorites] = useState({});
      const {addToCart, loading} = useCart()
      const navigate = useNavigate()
    const handleFavoriteToggle = (productId) => {
        setFavorites(prev => ({
          ...prev,
          [productId]: !prev[productId]
        }));
      };
    
      const handleAddToCart = async (product) => {
          const sessionToken = localStorage.getItem("sessionToken");
          if(sessionToken){
            addToCart(product)
        }else{
            toast.warning("Please login and get back")
            navigate("/login")
        }
      };
    return (
        <>
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.objectId}>
                <StyledCard>
                    <CardMedia
                    
                        // width="200px"
                        component="img"
                        // height="200"
                        image={product.image || "https://via.placeholder.com/300x200?text=No+Image"}
                        alt={product.title}
                        sx={{ objectFit: 'cover',
                            maxWidth:"215px",
                            maxHeight:"200px"
                        }}
                    />

                    <FavoriteButton
                        isfavorite={favorites[product.objectId]?.toString()}
                        onClick={() => handleFavoriteToggle(product.objectId)}
                    >
                        {favorites[product.objectId] ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </FavoriteButton>

                    <QuickViewButton
                        className="quick-view-btn"
                        size="small"
                        variant="contained"
                        component={RouterLink}
                        to={`/product/${product.objectId}`}
                    >
                        Quick View
                    </QuickViewButton>

                    <CardContent sx={{ flexGrow: 1 }}>
                        <Typography
                            variant="h6"
                            component="h2"
                            sx={{
                                fontWeight: 600,
                                mb: 1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {product.title}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Chip
                                label={product.categories}
                                size="small"
                                color="primary"
                                variant="outlined"
                            />
                            {product.quantity <= 5 && (
                                <Chip
                                    label="Low Stock"
                                    size="small"
                                    color="warning"
                                    variant="outlined"
                                />
                            )}
                        </Box>

                        {/* <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Rating value={product.rating || 4} size="small" readOnly />
                      <Typography variant="body2" color="text.secondary">
                        ({product.reviews || 0})
                      </Typography>
                    </Box> */}
                        <Box sx={{ display: 'flex', justifyContent: "space-between", flexWrap: "wrap", pr: 1, alignItems: 'center', mb: 1 }}>

                            <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                                ${product.price?.toFixed(2)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Quantity: {product.quantity}
                            </Typography>
                        </Box>

                    </CardContent>

                    <CardActions sx={{ p: 2, pt: 0 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            startIcon={<CartIcon />}
                            onClick={() => handleAddToCart(product)}
                            disabled={product.quantity === 0 || loading}
                        >
                            {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </Button>
                    </CardActions>
                </StyledCard>
            </Grid>
        </>
    )
}

export default ProductCard