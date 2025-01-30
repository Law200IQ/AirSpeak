import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import socket from '../socket';

const ChatContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: '20px',
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  color: 'white'
});

const CallSection = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
  borderRadius: '10px',
  background: 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  width: '100%',
  maxWidth: '400px',
  margin: '20px 0'
});

const ActionButtons = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
  width: '100%'
});

const LogoText = styled(Typography)({
  fontSize: '2.5rem',
  fontWeight: 'bold',
  marginBottom: '20px',
  color: 'white',
  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
  '& span': {
    color: '#FFD700'
  }
});

const ChatInterface = ({ setIsInCall }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [partnerCountry, setPartnerCountry] = useState(null);
  const socketRef = useRef(socket);

  const getCountryNameAndFlag = useCallback((countryCode) => {
    if (!countryCode) return null;
    
    try {
      const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
      let name = regionNames.of(countryCode);
      let flag = countryCode
        .toUpperCase()
        .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt()));
      
      console.log('Country info:', { countryCode, name, flag });
      return { name, flag };
    } catch (error) {
      console.error('Error getting country name:', error);
      return null;
    }
  }, []);

  const handleCall = useCallback(() => {
    if (!socketRef.current) return;
    
    setIsSearching(true);
    socketRef.current.emit('startCall');
    
    toast.info('Searching for a partner...', {
      position: "top-center",
      autoClose: 3000
    });
  }, [setIsSearching]);

  useEffect(() => {
    if (socket) {
      socket.on('callStarted', (data) => {
        console.log('Call started with data:', data);
        const { targetId, targetCountry } = data;
        
        if (!targetCountry) {
          console.log('No target country provided');
          setIsInCall(true);
          setIsSearching(false);
          return;
        }

        const countryInfo = getCountryNameAndFlag(targetCountry);
        console.log('Processed country info:', countryInfo);
        
        if (countryInfo) {
          setPartnerCountry(countryInfo);
          console.log('Set partner country:', countryInfo);
        }

        setIsInCall(true);
        setIsSearching(false);
      });

      socket.on('noPartnerFound', () => {
        console.log('No partner found');
        setIsSearching(false);
        toast.info('No partner found. Try again!', {
          position: "top-center",
          autoClose: 3000
        });
      });

      return () => {
        socket.off('callStarted');
        socket.off('noPartnerFound');
      };
    }
  }, [socket, setIsInCall, getCountryNameAndFlag]);

  return (
    <ChatContainer>
      <CallSection>
        <LogoText>
          Air<span>Speak</span>
        </LogoText>
        
        {isInCall && partnerCountry?.name && partnerCountry?.flag && (
          <Typography 
            variant="h6" 
            color="white" 
            sx={{ 
              mb: 2,
              textAlign: 'center',
              fontSize: '1.25rem',
              fontWeight: 500,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <span>Your partner is from</span>
            <span style={{ 
              fontSize: '2.5rem', 
              lineHeight: 1,
              marginTop: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              {partnerCountry.flag} {partnerCountry.name}
            </span>
          </Typography>
        )}
        
        <ActionButtons>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCall}
              disabled={isSearching}
              fullWidth
              sx={{
                backgroundColor: '#4CAF50',
                '&:hover': {
                  backgroundColor: '#45a049'
                }
              }}
            >
              {isSearching ? 'Searching...' : 'Start Call'}
            </Button>
          </Box>
        </ActionButtons>
      </CallSection>
    </ChatContainer>
  );
};

export default ChatInterface;
