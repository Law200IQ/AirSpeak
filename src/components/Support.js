import React from 'react';
import {
  Box,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Close as CloseIcon } from '@mui/icons-material';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    backgroundColor: '#1C1C2D',
    color: 'white',
    minWidth: '400px',
    maxWidth: '500px',
    borderRadius: '12px',
    margin: '16px',
    [theme.breakpoints.down('sm')]: {
      minWidth: 'calc(100% - 32px)',
      margin: '16px',
    },
  },
}));

const PaypalButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#0070BA',
  color: 'white',
  padding: '12px 24px',
  borderRadius: '24px',
  textTransform: 'none',
  fontSize: '16px',
  marginTop: '24px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  whiteSpace: 'nowrap',
  [theme.breakpoints.down('sm')]: {
    fontSize: '14px',
    padding: '10px 20px',
  },
  '&:hover': {
    backgroundColor: '#005ea6',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 112, 186, 0.4)',
    '&::before': {
      transform: 'translateX(100%)',
    }
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    transition: 'transform 0.5s ease',
  }
}));

const Support = ({ open, onClose }) => {
  const handlePaypalSupport = () => {
    // Replace with your PayPal.me link
    window.open('https://paypal.me/YourPayPalLink', '_blank');
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogContent sx={{ 
        p: { xs: 2, sm: 4 },
        '& .MuiTypography-root': {
          fontSize: { xs: '14px', sm: '16px' },
        },
        '& .MuiTypography-h5': {
          fontSize: { xs: '20px', sm: '24px' },
        },
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Support AirSpeak 🎉
          </Typography>
        </Box>

        <Typography variant="body1" sx={{ mb: 2 }}>
          Dear AirSpeak Community,
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          Your support is the lifeblood of AirSpeak, and we're grateful for your contributions. 
          Whether through donations or other means, your involvement plays a vital role in enhancing and 
          maintaining our platform.
        </Typography>

        <Typography variant="body1" sx={{ mb: 2 }}>
          Your generosity assists us in:
        </Typography>

        <Box component="ul" sx={{ mb: 3, pl: 3 }}>
          <Typography component="li" sx={{ mb: 1 }}>
            Advancing the platform with new features
          </Typography>
          <Typography component="li" sx={{ mb: 1 }}>
            Ensuring a seamless and enjoyable experience
          </Typography>
          <Typography component="li" sx={{ mb: 1 }}>
            Supporting ongoing operations and infrastructure
          </Typography>
        </Box>

        <Typography variant="body1" sx={{ mb: 3 }}>
          We deeply appreciate your commitment to AirSpeak's success. Every form of support, 
          big or small, contributes to our continued growth and sustainability.
        </Typography>

        <Box sx={{ textAlign: 'center' }}>
          <PaypalButton
            onClick={handlePaypalSupport}
            startIcon={
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15 8L21 9L16.5 14L18 20L12 17L6 20L7.5 14L3 9L9 8L12 2Z" fill="currentColor"/>
              </svg>
            }
          >
            Fuel Our Journey 🚀
          </PaypalButton>
          <Typography variant="caption" sx={{ display: 'block', mt: 2, color: 'text.secondary' }}>
            Every star you add brightens our path forward
          </Typography>
        </Box>
      </DialogContent>
    </StyledDialog>
  );
};

export default Support;
