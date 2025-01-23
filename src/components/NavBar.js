import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  Box, 
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import TuneIcon from '@mui/icons-material/Tune';
import FilterPanel from './FilterPanel';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#1C1C2D',
  boxShadow: 'none',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
}));

const LogoText = styled(Typography)(({ theme }) => ({
  color: 'white',
  fontSize: '24px',
  fontWeight: 'bold',
  letterSpacing: '0.5px',
  cursor: 'pointer',
  '& span': {
    color: '#6C5DD3',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '20px',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  color: 'white',
  textTransform: 'none',
  padding: '6px 16px',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}));

const SupportButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#6C5DD3',
  color: 'white',
  textTransform: 'none',
  borderRadius: '20px',
  padding: '6px 16px',
  '&:hover': {
    backgroundColor: '#5648B2',
  },
}));

const FilterButton = styled(Button)(({ theme }) => ({
  color: 'white',
  textTransform: 'none',
  padding: '6px 16px',
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '20px',
  },
}));

const NavBar = ({ socket }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleFilterOpen = () => {
    setFilterOpen(true);
  };

  const handleFilterClose = () => {
    setFilterOpen(false);
  };

  const drawer = (
    <Box sx={{ width: 250, bgcolor: '#1C1C2D', height: '100%', color: 'white' }}>
      <List>
        <ListItem component={Link} to="/" onClick={handleDrawerToggle}>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem component={Link} to="/about" onClick={handleDrawerToggle}>
          <ListItemText primary="About Us" />
        </ListItem>
        <ListItem component={Link} to="/contact" onClick={handleDrawerToggle}>
          <ListItemText primary="Contact" />
        </ListItem>
        <ListItem onClick={() => { window.open('https://paypal.me/YourPayPalLink', '_blank'); handleDrawerToggle(); }}>
          <ListItemText 
            primary="Support Us" 
            sx={{ 
              color: '#6C5DD3',
              fontWeight: 'bold'
            }} 
          />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <StyledAppBar position="fixed">
        <Toolbar>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
            <LogoText component={Link} to="/" sx={{ textDecoration: 'none' }}>
              Air<span>Speak</span>
            </LogoText>
            
            {!isMobile && (
              <FilterButton onClick={handleFilterOpen} startIcon={<TuneIcon />}>
                Filters
              </FilterButton>
            )}
          </Box>

          {isMobile ? (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <IconButton
                color="inherit"
                onClick={handleFilterOpen}
                sx={{ 
                  backgroundColor: filterOpen ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                }}
              >
                <TuneIcon />
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <StyledButton component={Link} to="/">
                Home
              </StyledButton>
              <StyledButton component={Link} to="/about">
                About Us
              </StyledButton>
              <StyledButton component={Link} to="/contact">
                Contact
              </StyledButton>
              <SupportButton onClick={() => window.open('https://paypal.me/YourPayPalLink', '_blank')}>
                Support Us
              </SupportButton>
            </Box>
          )}
        </Toolbar>
      </StyledAppBar>

      <FilterPanel 
        open={filterOpen}
        onClose={handleFilterClose}
        socket={socket}
      />

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 250,
            backgroundColor: '#1C1C2D',
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default NavBar;
