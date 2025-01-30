import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Container, Typography, Link as MuiLink, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(26, 26, 46, 0.95)',
  padding: theme.spacing(6, 0),
  marginTop: 'auto',
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
}));

const FooterLink = styled(MuiLink)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textDecoration: 'none',
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

const Logo = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#fff',
  marginBottom: 16,
  display: 'flex',
  alignItems: 'center',
  '& .air': {
    color: theme.palette.primary.main,
  }
}));

const Footer = () => {
  return (
    <FooterContainer>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column" alignItems="flex-start">
              <Logo variant="h4">
                <span className="air">Air</span>Speak
              </Logo>
              <Typography variant="body2" color="textSecondary">
                Connect with strangers through voice chat.
                Experience meaningful conversations in a safe environment.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="h6" gutterBottom>
              Company
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <FooterLink component={Link} to="/about">About Us</FooterLink>
              <FooterLink component={Link} to="/contact">Contact</FooterLink>
              <FooterLink component={Link} to="/support">Support Us</FooterLink>
            </Box>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="h6" gutterBottom>
              Legal
            </Typography>
            <Box display="flex" flexDirection="column" gap={1}>
              <FooterLink component={Link} to="/privacy">Privacy Policy</FooterLink>
              <FooterLink component={Link} to="/terms">Terms of Service</FooterLink>
              <FooterLink component={Link} to="/guidelines">Community Guidelines</FooterLink>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Stay Connected
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Join our community and stay updated with the latest features and announcements.
            </Typography>
          </Grid>
        </Grid>
        <Box mt={4} pt={4} borderTop="1px solid rgba(255, 255, 255, 0.1)">
          <Typography variant="body2" color="textSecondary" align="center">
            {new Date().getFullYear()} AirSpeak. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
