import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  List, 
  ListItem, 
  ListItemText,
  styled 
} from '@mui/material';
import * as Flags from 'country-flag-icons/react/3x2';

const countries = {
  'US': 'United States',
  'GB': 'United Kingdom',
  'CA': 'Canada',
  'AU': 'Australia',
  'DE': 'Germany',
  'FR': 'France',
  'IT': 'Italy',
  'ES': 'Spain',
  'JP': 'Japan',
  'KR': 'South Korea',
  'CN': 'China',
  'IN': 'India',
  'BR': 'Brazil',
  'RU': 'Russia',
  'SA': 'Saudi Arabia',
  'AE': 'United Arab Emirates',
  'EG': 'Egypt',
  // Add more countries as needed
};

const SelectorContainer = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(28, 28, 45, 0.98)',
  padding: '20px',
  borderRadius: '12px',
  width: '300px',
  maxHeight: '400px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  position: 'absolute',
  top: '100%',
  left: 0,
  zIndex: 1100,
}));

const ScrollableList = styled(List)({
  overflowY: 'auto',
  flex: 1,
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '4px',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.3)',
    },
  },
});

const CountrySelector = ({ onSelect, onClose, type }) => {
  const [search, setSearch] = useState('');

  const filteredCountries = Object.entries(countries).filter(([code, name]) =>
    name.toLowerCase().includes(search.toLowerCase()) ||
    code.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (code) => {
    onSelect(code);
    onClose();
  };

  return (
    <SelectorContainer>
      <TextField
        fullWidth
        size="small"
        placeholder="Search countries..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          '& .MuiOutlinedInput-root': {
            color: 'white',
            '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
            '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.2)' },
            '&.Mui-focused fieldset': { borderColor: '#6C5DD3' },
          },
          '& input::placeholder': {
            color: 'rgba(255, 255, 255, 0.5)',
          },
        }}
      />

      <ScrollableList>
        {filteredCountries.map(([code, name]) => {
          const Flag = Flags[code];
          return (
            <ListItem
              key={code}
              onClick={() => handleSelect(code)}
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
                borderRadius: '4px',
              }}
            >
              <Box sx={{ mr: 2, width: 24, height: 16 }}>
                {Flag && <Flag />}
              </Box>
              <ListItemText 
                primary={name}
                secondary={code}
                primaryTypographyProps={{
                  color: 'white',
                  fontSize: '14px',
                }}
                secondaryTypographyProps={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: '12px',
                }}
              />
            </ListItem>
          );
        })}
      </ScrollableList>
    </SelectorContainer>
  );
};

export default CountrySelector;
