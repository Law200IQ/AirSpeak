import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { AppBar, Toolbar, Button, Box, IconButton, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import FilterDialog from './FilterDialog';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'transparent',
  boxShadow: 'none',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
}));

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
});

const Logo = styled('img')({
  height: 40,
  cursor: 'pointer',
});

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  marginLeft: theme.spacing(2),
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
}));

const FilterButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.main,
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: '8px',
  padding: '8px 16px',
  marginRight: theme.spacing(2),
  gap: '8px',
  '&:hover': {
    backgroundColor: 'rgba(108, 99, 255, 0.1)',
  },
}));

const Header = ({ socket }) => {
  const [filterOpen, setFilterOpen] = useState(false);

  const handleOpenFilter = () => {
    setFilterOpen(true);
  };

  const handleCloseFilter = () => {
    setFilterOpen(false);
  };

  return (
    <>
      <StyledAppBar position="static">
        <StyledToolbar>
          <Link to="/">
            <Logo src="/logo.svg" alt="AirSpeak" />
          </Link>
          <Box display="flex" alignItems="center">
            <Tooltip title="Country Filters">
              <FilterButton 
                onClick={handleOpenFilter}
                startIcon={<FilterAltIcon />}
              >
                Filters
              </FilterButton>
            </Tooltip>
            <NavButton component={Link} to="/">
              Home
            </NavButton>
            <NavButton component={Link} to="/about">
              About Us
            </NavButton>
            <NavButton component={Link} to="/contact">
              Contact
            </NavButton>
            <NavButton
              component={Link}
              to="/support"
              variant="contained"
              color="primary"
              sx={{ borderRadius: '20px' }}
            >
              Support Us
            </NavButton>
          </Box>
        </StyledToolbar>
      </StyledAppBar>
      <FilterDialog 
        open={filterOpen} 
        onClose={handleCloseFilter}
        socket={socket}
      />
    </>
  );
};

export default Header;
