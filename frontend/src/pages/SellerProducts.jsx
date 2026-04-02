// src/pages/MyProducts.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Snackbar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Tooltip,
  Fab,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Image as ImageIcon,
  MoreVert as MoreVertIcon,
  Visibility as ViewIcon,
  Inventory as InventoryIcon,
  AttachMoney as MoneyIcon,
  Category as CategoryIcon
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { useAuth } from "../context/AuthContext";
// import { fetchLoginUserProducService, deleteProductService, updateProductService } from "../services/productServices";
// import { useAuth } from "../context/AuthContext"; // You'll need to create this

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
}));

const MyProducts = () => {
  // const { user } = useAuth(); // Get logged-in user from auth context
  const { user } = useAuth()
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [anchorEl, setAnchorEl] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, productId: null });

  // Form state for editing
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    quantity: '',
    image: '',
    categories: ''
  });

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      const result = await fetchLoginUserProducService(user);
      setProducts(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setFormData({
      title: product.get("title"),
      price: product.get("price") * product.get("quantity"),
      quantity: product.get("quantity"),
      image: product.get("image") || '',
      categories: product.get("categories")
    });
    setOpenDialog(true);
  };

  const handleUpdateProduct = async () => {
    try {
      setLoading(true);
      await updateProductService(
        formData.title,
        formData.price,
        formData.quantity,
        formData.image,
        user,
        selectedProduct.id
      );
      setSuccess("Product updated successfully!");
      setOpenDialog(false);
      fetchMyProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (productId) => {
    setDeleteConfirm({ open: true, productId });
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      await deleteProductService(user, deleteConfirm.productId);
      setSuccess("Product deleted successfully!");
      setDeleteConfirm({ open: false, productId: null });
      fetchMyProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedProduct(null);
    setFormData({
      title: '',
      price: '',
      quantity: '',
      image: '',
      categories: ''
    });
  };

  const totalValue = products.reduce((sum, p) => 
    sum + (p.get("price") * p.get("quantity")), 0
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            My Products
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your product listings
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tooltip title="Grid View">
            <IconButton 
              color={viewMode === 'grid' ? 'primary' : 'default'}
              onClick={() => setViewMode('grid')}
            >
              <ViewIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Table View">
            <IconButton 
              color={viewMode === 'table' ? 'primary' : 'default'}
              onClick={() => setViewMode('table')}
            >
              <InventoryIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            href="/profile/add-product"
          >
            Add New Product
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
            <InventoryIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4">{products.length}</Typography>
            <Typography variant="body2">Total Products</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'success.light', color: 'white' }}>
            <MoneyIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4">${totalValue.toFixed(2)}</Typography>
            <Typography variant="body2">Inventory Value</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'warning.light', color: 'white' }}>
            <CategoryIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4">
              {new Set(products.map(p => p.get("categories"))).size}
            </Typography>
            <Typography variant="body2">Categories</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'info.light', color: 'white' }}>
            <InventoryIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4">
              {products.reduce((sum, p) => sum + p.get("quantity"), 0)}
            </Typography>
            <Typography variant="body2">Total Quantity</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Products Display */}
      {viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <StyledCard>
                <CardMedia
                  component="img"
                  height="160"
                  image={product.get("image") || "https://via.placeholder.com/300x160"}
                  alt={product.get("title")}
                />
                <CardContent>
                  <Typography variant="h6" noWrap>
                    {product.get("title")}
                  </Typography>
                  <Chip 
                    label={product.get("categories")} 
                    size="small" 
                    sx={{ mb: 1 }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Qty: {product.get("quantity")}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      ${product.get("price")?.toFixed(2)}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditClick(product)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDeleteClick(product.id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Total Value</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Avatar 
                      src={product.get("image")} 
                      variant="rounded"
                      sx={{ width: 50, height: 50 }}
                    >
                      <ImageIcon />
                    </Avatar>
                  </TableCell>
                  <TableCell>{product.get("title")}</TableCell>
                  <TableCell>{product.get("categories")}</TableCell>
                  <TableCell align="right">${product.get("price")?.toFixed(2)}</TableCell>
                  <TableCell align="right">{product.get("quantity")}</TableCell>
                  <TableCell align="right">
                    ${(product.get("price") * product.get("quantity")).toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => handleEditClick(product)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDeleteClick(product.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Title"
              fullWidth
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
            <TextField
              label="Price"
              type="number"
              fullWidth
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
            />
            <TextField
              label="Quantity"
              type="number"
              fullWidth
              value={formData.quantity}
              onChange={(e) => setFormData({...formData, quantity: e.target.value})}
            />
            <TextField
              label="Category"
              fullWidth
              value={formData.categories}
              onChange={(e) => setFormData({...formData, categories: e.target.value})}
            />
            <TextField
              label="Image URL"
              fullWidth
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleUpdateProduct} 
            variant="contained"
            disabled={loading}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirm.open} onClose={() => setDeleteConfirm({ open: false, productId: null })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this product?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm({ open: false, productId: null })}>
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notifications */}
      <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess(null)}>
        <Alert severity="success" onClose={() => setSuccess(null)}>{success}</Alert>
      </Snackbar>
      
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
      </Snackbar>
    </Container>
  );
};

export default MyProducts;