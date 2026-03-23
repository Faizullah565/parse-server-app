// src/pages/Products.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  Button,
  IconButton,
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Rating,
  Skeleton,
  Alert,
  Paper,
  Breadcrumbs,
  Link,
  Fab,
  Zoom,
  Badge,
  Tooltip
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Sort as SortIcon,
  GridView as GridViewIcon,
  ViewList as ViewListIcon,
  ArrowUpward as ArrowUpwardIcon
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";
import api from "../services/api";
import { fetchProducts } from "../services/productServices";
import ProductCard from "../components/ProductCard";

const ScrollToTop = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  zIndex: 1000,
}));

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  // const [favorites, setFavorites] = useState({});
  const [viewMode, setViewMode] = useState('grid');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [categories, setCategories] = useState([]);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchAllProducts();
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      // Using your backend API endpoint
      const response = await fetchProducts();
      console.log("🚀 ~ fetchAllProducts ~ response:", response)
      setProducts(response?.result);

      // Extract unique categories
      const uniqueCategories = [...new Set(response?.result.map(p => p.categories))];
      setCategories(['all', ...uniqueCategories]);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    setShowScrollTop(window.scrollY > 400);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.title?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || product.categories === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "priceLow":
          return a.price - b.price;
        case "priceHigh":
          return b.price - a.price;
        case "nameAsc":
          return a.title.localeCompare(b.title);
        case "nameDesc":
          return b.title.localeCompare(a.title);
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  // Pagination
  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
  const displayedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSortBy("newest");
    setPage(1);
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={fetchProducts}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link component={RouterLink} to="/" color="inherit">
            Home
          </Link>
          <Typography color="text.primary">Products</Typography>
        </Breadcrumbs>

        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>
            Our Products
          </Typography>
          <Badge badgeContent={filteredProducts.length} color="primary" showZero>
            <Typography variant="h6" color="text.secondary">
              Items Available
            </Typography>
          </Badge>
        </Box>

        {/* Search and Filter Bar */}
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearchTerm("")}>
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Category"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat === "all" ? "All Categories" : cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <SortIcon />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="newest">Newest First</MenuItem>
                  <MenuItem value="priceLow">Price: Low to High</MenuItem>
                  <MenuItem value="priceHigh">Price: High to Low</MenuItem>
                  <MenuItem value="nameAsc">Name: A to Z</MenuItem>
                  <MenuItem value="nameDesc">Name: Z to A</MenuItem>
                  <MenuItem value="rating">Top Rated</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={2}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={clearFilters}
                  startIcon={<FilterIcon />}
                >
                  Clear
                </Button>
                <Tooltip title="Grid View">
                  <IconButton
                    color={viewMode === 'grid' ? 'primary' : 'default'}
                    onClick={() => setViewMode('grid')}
                  >
                    <GridViewIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="List View">
                  <IconButton
                    color={viewMode === 'list' ? 'primary' : 'default'}
                    onClick={() => setViewMode('list')}
                  >
                    <ViewListIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Results count */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Showing {displayedProducts.length} of {filteredProducts.length} products
          </Typography>
        </Box>

        {/* Products Grid/List */}
        <Grid container spacing={3}>
          {loading ? (
            // Loading skeletons
            [...Array(10)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
                <Skeleton variant="text" height={30} sx={{ mt: 1 }} />
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
              </Grid>
            ))
          ) : displayedProducts.length > 0 ? (
            displayedProducts.map((product) => (
              <ProductCard key={product.objectId} product={product} />
            ))
          ) : (
            <Grid item xs={12}>
              <Paper sx={{ textAlign: 'center', py: 8, px: 3 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No products found
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Try adjusting your search or filter criteria
                </Typography>
                <Button variant="contained" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </Paper>
            </Grid>
          )}
        </Grid>

        {/* Pagination */}
        {pageCount > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Pagination
              count={pageCount}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        )}

        {/* Scroll to Top Button */}
        <Zoom in={showScrollTop}>
          <ScrollToTop color="primary" onClick={scrollToTop}>
            <ArrowUpwardIcon />
          </ScrollToTop>
        </Zoom>
      </Container>
    </Box>
  );
};

export default Products;