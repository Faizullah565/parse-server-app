import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  useTheme,
  useMediaQuery
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

const HeroSection = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[900],
  color: theme.palette.common.white,
  minHeight: '560px',
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    minHeight: 'auto',
    padding: theme.spacing(8, 0),
  },
}));

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh' }}>
      {/* Hero Section */}
      <HeroSection>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center"
          sx={{
            display:"flex"
          }}
          >
            <Grid 
            sx={{
              md:6,
              xs:12
            }}
            >
              <Typography
                variant={isMobile ? "h3" : "h2"}
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  textAlign: { xs: 'center', md: 'left' },
                  lineHeight: 1.2
                }}
              >
                Discover Your Perfect Style
              </Typography>
              
              <Typography
                variant="h6"
                sx={{
                  color: 'grey.400',
                  mb: 4,
                  textAlign: { xs: 'center', md: 'left' },
                  fontWeight: 400,
                  lineHeight: 1.6
                }}
              >
                Shop the latest trends in fashion and accessories. 
                Quality products, amazing deals.
              </Typography>

              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingBagIcon />}
                  sx={{
                    py: 1.5,
                    px: 4,
                    fontSize: '1.1rem',
                    backgroundColor: 'primary.main',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[8],
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Shop Now
                </Button>
              </Box>
            </Grid>

            <Grid
            
            sx={{
              xs:12,
              md:6
            }}>
              <Box
                component="img"
                src="data:image/jpeg;base64,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"
                alt="Fashion hero"
                sx={{
                  width: '100%',
                  height: isMobile ? 300 : 450,
                  objectFit: 'cover',
                  borderRadius: 3,
                  boxShadow: theme.shadows[10],
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  }
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </HeroSection>
    </Box>
  );
};

export default Home;