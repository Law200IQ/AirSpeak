import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Drawer,
  TextField,
  Menu,
  MenuItem,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import * as Flags from 'country-flag-icons/react/3x2';

const DrawerContent = styled(Box)(({ theme }) => ({
  width: '300px',
  height: '100%',
  backgroundColor: '#1a1a2e',
  color: '#fff',
  padding: '20px'
}));

const DrawerHeader = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px',
  position: 'relative',
  backgroundColor: '#1a1a2e',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  '& .MuiIconButton-root': {
    color: '#fff'
  }
});

const HeaderTitle = styled(Box)({
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: '#fff',
  '& svg': {
    color: '#FF9800'
  }
});

const SearchSection = styled(Box)(({ theme, active, error }) => ({
  backgroundColor: active ? '#2a2a4d' : '#242444',
  borderRadius: '12px',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  border: '1px solid transparent',
  '&:hover': {
    backgroundColor: '#2a2a4d',
    border: `1px solid ${error ? theme.palette.error.main : theme.palette.primary.main}`
  },
  ...(active && {
    border: `1px solid ${error ? theme.palette.error.main : theme.palette.primary.main}`
  })
}));

const CountryChip = styled(Chip)(({ theme }) => ({
  backgroundColor: '#242444',
  color: '#fff',
  margin: '4px',
  '& .MuiChip-deleteIcon': {
    color: '#fff'
  }
}));

const FlagIcon = styled('span')({
  marginRight: '8px',
  '& svg': {
    width: '20px',
    height: '15px',
    verticalAlign: 'middle'
  }
});

const countries = [
  { code: 'AF', name: 'Afghanistan', flag: Flags.AF },
  { code: 'AL', name: 'Albania', flag: Flags.AL },
  { code: 'DZ', name: 'Algeria', flag: Flags.DZ },
  { code: 'AD', name: 'Andorra', flag: Flags.AD },
  { code: 'AO', name: 'Angola', flag: Flags.AO },
  { code: 'AG', name: 'Antigua and Barbuda', flag: Flags.AG },
  { code: 'AR', name: 'Argentina', flag: Flags.AR },
  { code: 'AM', name: 'Armenia', flag: Flags.AM },
  { code: 'AU', name: 'Australia', flag: Flags.AU },
  { code: 'AT', name: 'Austria', flag: Flags.AT },
  { code: 'AZ', name: 'Azerbaijan', flag: Flags.AZ },
  { code: 'BS', name: 'Bahamas', flag: Flags.BS },
  { code: 'BH', name: 'Bahrain', flag: Flags.BH },
  { code: 'BD', name: 'Bangladesh', flag: Flags.BD },
  { code: 'BB', name: 'Barbados', flag: Flags.BB },
  { code: 'BY', name: 'Belarus', flag: Flags.BY },
  { code: 'BE', name: 'Belgium', flag: Flags.BE },
  { code: 'BZ', name: 'Belize', flag: Flags.BZ },
  { code: 'BJ', name: 'Benin', flag: Flags.BJ },
  { code: 'BT', name: 'Bhutan', flag: Flags.BT },
  { code: 'BO', name: 'Bolivia', flag: Flags.BO },
  { code: 'BA', name: 'Bosnia and Herzegovina', flag: Flags.BA },
  { code: 'BW', name: 'Botswana', flag: Flags.BW },
  { code: 'BR', name: 'Brazil', flag: Flags.BR },
  { code: 'BN', name: 'Brunei', flag: Flags.BN },
  { code: 'BG', name: 'Bulgaria', flag: Flags.BG },
  { code: 'BF', name: 'Burkina Faso', flag: Flags.BF },
  { code: 'BI', name: 'Burundi', flag: Flags.BI },
  { code: 'CV', name: 'Cabo Verde', flag: Flags.CV },
  { code: 'KH', name: 'Cambodia', flag: Flags.KH },
  { code: 'CM', name: 'Cameroon', flag: Flags.CM },
  { code: 'CA', name: 'Canada', flag: Flags.CA },
  { code: 'CF', name: 'Central African Republic', flag: Flags.CF },
  { code: 'TD', name: 'Chad', flag: Flags.TD },
  { code: 'CL', name: 'Chile', flag: Flags.CL },
  { code: 'CN', name: 'China', flag: Flags.CN },
  { code: 'CO', name: 'Colombia', flag: Flags.CO },
  { code: 'KM', name: 'Comoros', flag: Flags.KM },
  { code: 'CG', name: 'Congo', flag: Flags.CG },
  { code: 'CD', name: 'Congo (Democratic Republic)', flag: Flags.CD },
  { code: 'CR', name: 'Costa Rica', flag: Flags.CR },
  { code: 'HR', name: 'Croatia', flag: Flags.HR },
  { code: 'CU', name: 'Cuba', flag: Flags.CU },
  { code: 'CY', name: 'Cyprus', flag: Flags.CY },
  { code: 'CZ', name: 'Czech Republic', flag: Flags.CZ },
  { code: 'DK', name: 'Denmark', flag: Flags.DK },
  { code: 'DJ', name: 'Djibouti', flag: Flags.DJ },
  { code: 'DM', name: 'Dominica', flag: Flags.DM },
  { code: 'DO', name: 'Dominican Republic', flag: Flags.DO },
  { code: 'EC', name: 'Ecuador', flag: Flags.EC },
  { code: 'EG', name: 'Egypt', flag: Flags.EG },
  { code: 'SV', name: 'El Salvador', flag: Flags.SV },
  { code: 'GQ', name: 'Equatorial Guinea', flag: Flags.GQ },
  { code: 'ER', name: 'Eritrea', flag: Flags.ER },
  { code: 'EE', name: 'Estonia', flag: Flags.EE },
  { code: 'ET', name: 'Ethiopia', flag: Flags.ET },
  { code: 'FJ', name: 'Fiji', flag: Flags.FJ },
  { code: 'FI', name: 'Finland', flag: Flags.FI },
  { code: 'FR', name: 'France', flag: Flags.FR },
  { code: 'GA', name: 'Gabon', flag: Flags.GA },
  { code: 'GM', name: 'Gambia', flag: Flags.GM },
  { code: 'GE', name: 'Georgia', flag: Flags.GE },
  { code: 'DE', name: 'Germany', flag: Flags.DE },
  { code: 'GH', name: 'Ghana', flag: Flags.GH },
  { code: 'GR', name: 'Greece', flag: Flags.GR },
  { code: 'GD', name: 'Grenada', flag: Flags.GD },
  { code: 'GT', name: 'Guatemala', flag: Flags.GT },
  { code: 'GN', name: 'Guinea', flag: Flags.GN },
  { code: 'GW', name: 'Guinea-Bissau', flag: Flags.GW },
  { code: 'GY', name: 'Guyana', flag: Flags.GY },
  { code: 'HT', name: 'Haiti', flag: Flags.HT },
  { code: 'HN', name: 'Honduras', flag: Flags.HN },
  { code: 'HU', name: 'Hungary', flag: Flags.HU },
  { code: 'IS', name: 'Iceland', flag: Flags.IS },
  { code: 'IN', name: 'India', flag: Flags.IN },
  { code: 'ID', name: 'Indonesia', flag: Flags.ID },
  { code: 'IR', name: 'Iran', flag: Flags.IR },
  { code: 'IQ', name: 'Iraq', flag: Flags.IQ },
  { code: 'IE', name: 'Ireland', flag: Flags.IE },
  { code: 'IL', name: 'Israel', flag: Flags.IL },
  { code: 'IT', name: 'Italy', flag: Flags.IT },
  { code: 'JM', name: 'Jamaica', flag: Flags.JM },
  { code: 'JP', name: 'Japan', flag: Flags.JP },
  { code: 'JO', name: 'Jordan', flag: Flags.JO },
  { code: 'KZ', name: 'Kazakhstan', flag: Flags.KZ },
  { code: 'KE', name: 'Kenya', flag: Flags.KE },
  { code: 'KI', name: 'Kiribati', flag: Flags.KI },
  { code: 'KW', name: 'Kuwait', flag: Flags.KW },
  { code: 'KG', name: 'Kyrgyzstan', flag: Flags.KG },
  { code: 'LA', name: 'Laos', flag: Flags.LA },
  { code: 'LV', name: 'Latvia', flag: Flags.LV },
  { code: 'LB', name: 'Lebanon', flag: Flags.LB },
  { code: 'LS', name: 'Lesotho', flag: Flags.LS },
  { code: 'LR', name: 'Liberia', flag: Flags.LR },
  { code: 'LY', name: 'Libya', flag: Flags.LY },
  { code: 'LI', name: 'Liechtenstein', flag: Flags.LI },
  { code: 'LT', name: 'Lithuania', flag: Flags.LT },
  { code: 'LU', name: 'Luxembourg', flag: Flags.LU },
  { code: 'MG', name: 'Madagascar', flag: Flags.MG },
  { code: 'MW', name: 'Malawi', flag: Flags.MW },
  { code: 'MY', name: 'Malaysia', flag: Flags.MY },
  { code: 'MV', name: 'Maldives', flag: Flags.MV },
  { code: 'ML', name: 'Mali', flag: Flags.ML },
  { code: 'MT', name: 'Malta', flag: Flags.MT },
  { code: 'MH', name: 'Marshall Islands', flag: Flags.MH },
  { code: 'MR', name: 'Mauritania', flag: Flags.MR },
  { code: 'MU', name: 'Mauritius', flag: Flags.MU },
  { code: 'MX', name: 'Mexico', flag: Flags.MX },
  { code: 'FM', name: 'Micronesia', flag: Flags.FM },
  { code: 'MD', name: 'Moldova', flag: Flags.MD },
  { code: 'MC', name: 'Monaco', flag: Flags.MC },
  { code: 'MN', name: 'Mongolia', flag: Flags.MN },
  { code: 'ME', name: 'Montenegro', flag: Flags.ME },
  { code: 'MA', name: 'Morocco', flag: Flags.MA },
  { code: 'MZ', name: 'Mozambique', flag: Flags.MZ },
  { code: 'MM', name: 'Myanmar (Burma)', flag: Flags.MM },
  { code: 'NA', name: 'Namibia', flag: Flags.NA },
  { code: 'NR', name: 'Nauru', flag: Flags.NR },
  { code: 'NP', name: 'Nepal', flag: Flags.NP },
  { code: 'NL', name: 'Netherlands', flag: Flags.NL },
  { code: 'NZ', name: 'New Zealand', flag: Flags.NZ },
  { code: 'NI', name: 'Nicaragua', flag: Flags.NI },
  { code: 'NE', name: 'Niger', flag: Flags.NE },
  { code: 'NG', name: 'Nigeria', flag: Flags.NG },
  { code: 'NO', name: 'Norway', flag: Flags.NO },
  { code: 'OM', name: 'Oman', flag: Flags.OM },
  { code: 'PK', name: 'Pakistan', flag: Flags.PK },
  { code: 'PW', name: 'Palau', flag: Flags.PW },
  { code: 'PA', name: 'Panama', flag: Flags.PA },
  { code: 'PG', name: 'Papua New Guinea', flag: Flags.PG },
  { code: 'PY', name: 'Paraguay', flag: Flags.PY },
  { code: 'PE', name: 'Peru', flag: Flags.PE },
  { code: 'PH', name: 'Philippines', flag: Flags.PH },
  { code: 'PL', name: 'Poland', flag: Flags.PL },
  { code: 'PT', name: 'Portugal', flag: Flags.PT },
  { code: 'QA', name: 'Qatar', flag: Flags.QA },
  { code: 'RO', name: 'Romania', flag: Flags.RO },
  { code: 'RU', name: 'Russia', flag: Flags.RU },
  { code: 'RW', name: 'Rwanda', flag: Flags.RW },
  { code: 'KN', name: 'Saint Kitts and Nevis', flag: Flags.KN },
  { code: 'LC', name: 'Saint Lucia', flag: Flags.LC },
  { code: 'VC', name: 'Saint Vincent and the Grenadines', flag: Flags.VC },
  { code: 'WS', name: 'Samoa', flag: Flags.WS },
  { code: 'SM', name: 'San Marino', flag: Flags.SM },
  { code: 'ST', name: 'Sao Tome and Principe', flag: Flags.ST },
  { code: 'SA', name: 'Saudi Arabia', flag: Flags.SA },
  { code: 'SN', name: 'Senegal', flag: Flags.SN },
  { code: 'RS', name: 'Serbia', flag: Flags.RS },
  { code: 'SC', name: 'Seychelles', flag: Flags.SC },
  { code: 'SL', name: 'Sierra Leone', flag: Flags.SL },
  { code: 'SG', name: 'Singapore', flag: Flags.SG },
  { code: 'SK', name: 'Slovakia', flag: Flags.SK },
  { code: 'SI', name: 'Slovenia', flag: Flags.SI },
  { code: 'SB', name: 'Solomon Islands', flag: Flags.SB },
  { code: 'SO', name: 'Somalia', flag: Flags.SO },
  { code: 'ZA', name: 'South Africa', flag: Flags.ZA },
  { code: 'KR', name: 'South Korea', flag: Flags.KR },
  { code: 'SS', name: 'South Sudan', flag: Flags.SS },
  { code: 'ES', name: 'Spain', flag: Flags.ES },
  { code: 'LK', name: 'Sri Lanka', flag: Flags.LK },
  { code: 'SD', name: 'Sudan', flag: Flags.SD },
  { code: 'SR', name: 'Suriname', flag: Flags.SR },
  { code: 'SZ', name: 'Eswatini (Swaziland)', flag: Flags.SZ },
  { code: 'SE', name: 'Sweden', flag: Flags.SE },
  { code: 'CH', name: 'Switzerland', flag: Flags.CH },
  { code: 'SY', name: 'Syria', flag: Flags.SY },
  { code: 'TW', name: 'Taiwan', flag: Flags.TW },
  { code: 'TJ', name: 'Tajikistan', flag: Flags.TJ },
  { code: 'TZ', name: 'Tanzania', flag: Flags.TZ },
  { code: 'TH', name: 'Thailand', flag: Flags.TH },
  { code: 'TL', name: 'Timor-Leste', flag: Flags.TL },
  { code: 'TG', name: 'Togo', flag: Flags.TG },
  { code: 'TO', name: 'Tonga', flag: Flags.TO },
  { code: 'TT', name: 'Trinidad and Tobago', flag: Flags.TT },
  { code: 'TN', name: 'Tunisia', flag: Flags.TN },
  { code: 'TR', name: 'Turkey', flag: Flags.TR },
  { code: 'TM', name: 'Turkmenistan', flag: Flags.TM },
  { code: 'TV', name: 'Tuvalu', flag: Flags.TV },
  { code: 'UG', name: 'Uganda', flag: Flags.UG },
  { code: 'UA', name: 'Ukraine', flag: Flags.UA },
  { code: 'AE', name: 'United Arab Emirates', flag: Flags.AE },
  { code: 'GB', name: 'United Kingdom', flag: Flags.GB },
  { code: 'US', name: 'United States', flag: Flags.US },
  { code: 'UY', name: 'Uruguay', flag: Flags.UY },
  { code: 'UZ', name: 'Uzbekistan', flag: Flags.UZ },
  { code: 'VU', name: 'Vanuatu', flag: Flags.VU },
  { code: 'VE', name: 'Venezuela', flag: Flags.VE },
  { code: 'VN', name: 'Vietnam', flag: Flags.VN },
  { code: 'YE', name: 'Yemen', flag: Flags.YE },
  { code: 'ZM', name: 'Zambia', flag: Flags.ZM },
  { code: 'ZW', name: 'Zimbabwe', flag: Flags.ZW }
].sort((a, b) => a.name.localeCompare(b.name));

const FilterDialog = ({ open, onClose, socket }) => {
  const [preferredCountries, setPreferredCountries] = useState(() => {
    const saved = localStorage.getItem('preferredCountries');
    return saved ? JSON.parse(saved) : [];
  });
  const [nonPreferredCountries, setNonPreferredCountries] = useState(() => {
    const saved = localStorage.getItem('nonPreferredCountries');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeSection, setActiveSection] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    socket.on('preferencesUpdated', () => {
      console.log('Country preferences updated successfully');
    });

    socket.on('preferencesError', () => {
      console.error('Error updating country preferences');
    });

    return () => {
      socket.off('preferencesUpdated');
      socket.off('preferencesError');
    };
  }, [socket]);

  const handleSectionClick = (section) => {
    setActiveSection(activeSection === section ? null : section);
    setSearchText('');
    setMenuAnchor(null);
  };

  const handleSearchFocus = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleSearchClose = () => {
    setMenuAnchor(null);
  };

  const handleAddPreferred = (country) => {
    if (preferredCountries.length < 2 && !preferredCountries.some(c => c.code === country.code)) {
      setPreferredCountries([...preferredCountries, country]);
      setSearchText('');
      handleSearchClose();
    }
  };

  const handleAddNonPreferred = (country) => {
    if (nonPreferredCountries.length < 2 && !nonPreferredCountries.some(c => c.code === country.code)) {
      setNonPreferredCountries([...nonPreferredCountries, country]);
      setSearchText('');
      handleSearchClose();
    }
  };

  const getFilteredCountries = () => {
    const available = countries.filter(country => 
      !preferredCountries.some(pc => pc.code === country.code) && 
      !nonPreferredCountries.some(npc => npc.code === country.code)
    );
    
    if (!searchText) return available;
    
    return available.filter(country => 
      country.name.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const handleRemovePreferred = (countryToRemove) => {
    setPreferredCountries(preferredCountries.filter(country => country.code !== countryToRemove.code));
  };

  const handleRemoveNonPreferred = (countryToRemove) => {
    setNonPreferredCountries(nonPreferredCountries.filter(country => country.code !== countryToRemove.code));
  };

  const handleApply = () => {
    localStorage.setItem('preferredCountries', JSON.stringify(preferredCountries));
    localStorage.setItem('nonPreferredCountries', JSON.stringify(nonPreferredCountries));
    
    if (socket && socket.connected) {
      console.log('Sending country preferences to server:');
      console.log('Preferred:', preferredCountries.map(c => c.code));
      console.log('Non-preferred:', nonPreferredCountries.map(c => c.code));
      
      socket.emit('updateCountryPreferences', {
        preferred: preferredCountries.map(c => c.code),
        nonPreferred: nonPreferredCountries.map(c => c.code)
      });
    } else {
      console.error('Socket not connected');
    }
    
    onClose();
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { backgroundColor: 'transparent' }
      }}
    >
      <DrawerContent>
        <DrawerHeader>
          <HeaderTitle>
            <LocalFireDepartmentIcon />
            <Typography variant="h6" component="div">
              Filters
            </Typography>
          </HeaderTitle>
          <Box sx={{ visibility: 'hidden' }}>
            <IconButton>
              <CloseIcon />
            </IconButton>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DrawerHeader>

        <SearchSection 
          active={activeSection === 'preferred'} 
          onClick={() => handleSectionClick('preferred')}
        >
          <Typography variant="subtitle1" color="primary" gutterBottom>
            Preferred Countries...
          </Typography>
          {preferredCountries.map((country) => {
            const Flag = country.flag;
            return (
              <CountryChip
                key={country.code}
                icon={<FlagIcon><Flag /></FlagIcon>}
                label={country.name}
                onDelete={() => handleRemovePreferred(country)}
              />
            );
          })}
          {activeSection === 'preferred' && (
            <Box mt={2}>
              <TextField
                fullWidth
                size="small"
                placeholder="Type to search..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onFocus={handleSearchFocus}
                inputRef={searchInputRef}
                sx={{
                  backgroundColor: '#1a1a2e',
                  borderRadius: '8px',
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)'
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#6C63FF'
                    }
                  }
                }}
              />
              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleSearchClose}
                PaperProps={{
                  sx: {
                    backgroundColor: '#1a1a2e',
                    color: '#fff',
                    width: searchInputRef.current?.offsetWidth,
                    maxHeight: 300,
                    marginTop: 1,
                    '& .MuiMenuItem-root': {
                      '&:hover': {
                        backgroundColor: 'rgba(108, 99, 255, 0.1)'
                      }
                    }
                  }
                }}
              >
                {getFilteredCountries().map((country) => {
                  const Flag = country.flag;
                  return (
                    <MenuItem
                      key={country.code}
                      onClick={() => handleAddPreferred(country)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <FlagIcon><Flag /></FlagIcon>
                      {country.name}
                    </MenuItem>
                  );
                })}
              </Menu>
            </Box>
          )}
        </SearchSection>

        <SearchSection 
          active={activeSection === 'nonPreferred'} 
          error 
          onClick={() => handleSectionClick('nonPreferred')}
        >
          <Typography variant="subtitle1" color="error" gutterBottom>
            Non-Preferred Countries...
          </Typography>
          {nonPreferredCountries.map((country) => {
            const Flag = country.flag;
            return (
              <CountryChip
                key={country.code}
                icon={<FlagIcon><Flag /></FlagIcon>}
                label={country.name}
                onDelete={() => handleRemoveNonPreferred(country)}
              />
            );
          })}
          {activeSection === 'nonPreferred' && (
            <Box mt={2}>
              <TextField
                fullWidth
                size="small"
                placeholder="Type to search..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onFocus={handleSearchFocus}
                inputRef={searchInputRef}
                sx={{
                  backgroundColor: '#1a1a2e',
                  borderRadius: '8px',
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)'
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#f44336'
                    }
                  }
                }}
              />
              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleSearchClose}
                PaperProps={{
                  sx: {
                    backgroundColor: '#1a1a2e',
                    color: '#fff',
                    width: searchInputRef.current?.offsetWidth,
                    maxHeight: 300,
                    marginTop: 1,
                    '& .MuiMenuItem-root': {
                      '&:hover': {
                        backgroundColor: 'rgba(244, 67, 54, 0.1)'
                      }
                    }
                  }
                }}
              >
                {getFilteredCountries().map((country) => {
                  const Flag = country.flag;
                  return (
                    <MenuItem
                      key={country.code}
                      onClick={() => handleAddNonPreferred(country)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      <FlagIcon><Flag /></FlagIcon>
                      {country.name}
                    </MenuItem>
                  );
                })}
              </Menu>
            </Box>
          )}
        </SearchSection>

        <Box mt={2}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {activeSection === 'preferred' ? (
              "If specified, we strive to match you with users from your preferred countries. Leave it blank to match any country."
            ) : activeSection === 'nonPreferred' ? (
              "Guaranteed exclusion from matches. Leave it blank to not exclude any country."
            ) : (
              "Click on a section to add countries"
            )}
          </Typography>
        </Box>

        <Button
          variant="contained"
          fullWidth
          onClick={handleApply}
          sx={{
            mt: 2,
            backgroundColor: '#6C63FF',
            '&:hover': {
              backgroundColor: '#5b52ff'
            }
          }}
        >
          Apply
        </Button>

        <Box sx={{ mt: 3, color: '#fff' }}>
          <Typography variant="subtitle2" sx={{ color: '#6C63FF', mb: 1 }}>
            Preferred Countries:
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
            If specified, we strive to match you with users from your preferred countries. 
            Leave it blank to match any country.
          </Typography>

          <Typography variant="subtitle2" sx={{ color: '#f44336', mb: 1 }}>
            Non-Preferred Countries:
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
            Guaranteed exclusion from matches. Leave it blank to not exclude any country.
          </Typography>

          <Typography variant="subtitle2" sx={{ color: '#ff9800', mb: 1 }}>
            Fallback Mechanism:
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 2 }}>
            If 15 subsequent attempts fail to find a match based on your preferred criteria, 
            we broaden the search while still avoiding non-preferred countries.
          </Typography>

          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block',
              fontStyle: 'italic',
              color: 'rgba(255, 255, 255, 0.5)',
              mt: 2,
              textAlign: 'center'
            }}
          >
            Note: Your preferences are a priority and we aim to respect your choices as closely as possible.
          </Typography>
        </Box>
      </DrawerContent>
    </Drawer>
  );
};

export default FilterDialog;
