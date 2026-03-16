import React from 'react';
import { Box, Container, Typography, Divider } from '@mui/material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box 
      component="footer"
      sx={{ 
        bgcolor: 'primary.dark',
        color: 'white',
        py: 4,
        mt: 'auto', // This pushes footer to bottom if using flexbox layout
        width: '100%'
      }}
    >
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', mb: 3 }} />
      
      <Container maxWidth="lg">
        <Typography 
          variant="body2" 
          align="center"
          sx={{ 
            color: 'rgba(255,255,255,0.7)',
            fontWeight: 300
          }}
        >
          &copy; {currentYear} My E-Commerce Store. All rights reserved.
        </Typography>
        
        <Typography 
          variant="caption" 
          align="center"
          display="block"
          sx={{ 
            color: 'rgba(255,255,255,0.5)',
            mt: 1,
            fontWeight: 300
          }}
        >
          Built with Material UI
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;