import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
  Paper,
  Avatar,
  CircularProgress,
  InputAdornment,
  IconButton
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import InventoryIcon from "@mui/icons-material/Inventory";

import { uploadImage, addProduct } from "../services/productServices";

const categoriesList = [
  "Shoes",
  "Clothes",
  "Electronics",
  "Accessories",
  "Sports"
];

// Styled components
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const UploadButton = styled(Button)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  '&:hover .upload-icon': {
    transform: 'translateY(-2px)',
  },
}));

const ImagePreview = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'inline-block',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  boxShadow: theme.shadows[3],
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'scale(1.02)',
  },
  '&:hover .delete-button': {
    opacity: 1,
  },
}));

const DeleteImageButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: 8,
  right: 8,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  opacity: 0,
  transition: 'opacity 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: '#ffffff',
  },
}));

export default function AddProduct() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  // image upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      const imageUrl = await uploadImage(file);
      setImage(imageUrl);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const handleRemoveImage = () => {
    setImage("");
  };

  // submit product
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(image);
    
    const productData = {
      title,
      price: Number(price),
      quantity: Number(quantity),
      description,
      categories,
      image: [image]
    };

    try {
      await addProduct(productData);
      alert("Product Added Successfully");
      
      // Reset form
      setTitle("");
      setPrice("");
      setQuantity("");
      setDescription("");
      setCategories([]);
      setImage("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container maxWidth="md">
      <Box 
        sx={{ 
          mt: { xs: 2, sm: 4, md: 5 },
          mb: { xs: 2, sm: 4, md: 5 }
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 2,
            background: 'linear-gradient(to bottom, #ffffff, #fafafa)'
          }}
        >
          <Typography 
            variant="h4" 
            gutterBottom
            sx={{
              fontWeight: 600,
              color: 'primary.main',
              mb: 3,
              borderBottom: '2px solid',
              borderColor: 'primary.light',
              pb: 1
            }}
          >
            Add New Product
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Product Title"
              fullWidth
              margin="normal"
              value={title}
              size="small"
              onChange={(e) => setTitle(e.target.value)}
              required
              variant="outlined"
              sx={{ mb: 2 }}
              InputProps={{
                sx: { borderRadius: 1.5 }
              }}
            />

            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <TextField
                label="Price"
                type="number"
                fullWidth
                size="small"
                margin="normal"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon color="primary" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 1.5 }
                }}
                sx={{ mb: 2, flex: 1 }}
              />

              <TextField
                label="Quantity"
                type="number"
                fullWidth
                size="small"
                margin="normal"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <InventoryIcon color="primary" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: 1.5 }
                }}
                sx={{ mb: 2, flex: 1 }}
              />
            </Box>

            <FormControl fullWidth margin="normal" sx={{ mb: 2 }}>
              <InputLabel>Categories</InputLabel>
              <Select
              size="small"
                multiple
                value={categories}
                onChange={(e) => setCategories(e.target.value)}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip 
                        key={value} 
                        label={value} 
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ borderRadius: 1 }}
                      />
                    ))}
                  </Box>
                )}
                sx={{ borderRadius: 1.5 }}
              >
                {categoriesList.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              margin="normal"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              variant="outlined"
              sx={{ mb: 3 }}
              InputProps={{
                sx: { borderRadius: 1.5 }
              }}
            />

            <Box 
              sx={{ 
                mt: 3,
                p: 3,
                border: '2px dashed',
                borderColor: 'primary.light',
                borderRadius: 2,
                backgroundColor: 'rgba(25, 118, 210, 0.02)',
                textAlign: 'center'
              }}
            >
              <UploadButton
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon className="upload-icon" />}
                disabled={loading}
                sx={{ 
                  mb: 2,
                  py: 1.5,
                  px: 4,
                  borderRadius: 2
                }}
              >
                {loading ? 'Uploading...' : 'Choose Image'}
                <VisuallyHiddenInput 
                  type="file" 
                  onChange={handleImageChange}
                  accept="image/*"
                />
              </UploadButton>

              {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <CircularProgress size={30} />
                </Box>
              )}

              {image && !loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <ImagePreview>
                    <Avatar
                      src={image}
                      alt="Product preview"
                      variant="rounded"
                      sx={{ 
                        width: 150, 
                        height: 150,
                        border: '2px solid',
                        borderColor: 'primary.main'
                      }}
                    />
                    <DeleteImageButton
                      className="delete-button"
                      size="small"
                      onClick={handleRemoveImage}
                      aria-label="remove image"
                    >
                      <DeleteIcon fontSize="small" color="error" />
                    </DeleteImageButton>
                  </ImagePreview>
                </Box>
              )}
            </Box>

            <Button
              variant="contained"
              type="submit"
              fullWidth
              disabled={loading || !image}
              sx={{ 
                mt: 4,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1.1rem',
                fontWeight: 600,
                background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                }
              }}
            >
              {loading ? 'Processing...' : 'Add Product'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}