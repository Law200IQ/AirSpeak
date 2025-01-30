import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { Call as CallIcon, Mic as MicIcon, MicOff as MicOffIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';

const ChatContainer = styled(Box)({
  width: '800px',
  margin: '0 auto',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  backgroundColor: '#1A1B1E',
  color: '#FFFFFF',
});

const CallSection = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: '20px',
});

const LogoText = styled(Typography)({
  fontSize: '2rem',
  fontWeight: 'bold',
  marginBottom: '1rem',
  color: '#FFFFFF',
  '& span': {
    color: '#6C5DD3',
  },
});

const ActionButtons = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '20px',
});

const ActionButton = styled(IconButton)(({ active }) => ({
  backgroundColor: active ? '#FF4B4B' : '#6C5DD3',
  color: '#FFFFFF',
  padding: '12px',
  '&:hover': {
    backgroundColor: active ? '#E53E3E' : '#5C4DB3',
  },
  '&.Mui-disabled': {
    backgroundColor: '#2D2D2D',
    color: '#666666',
  },
}));

const ChatInterface = ({ socket, isInCall, setIsInCall }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [partnerCountry, setPartnerCountry] = useState(null);
  const socketRef = useRef(socket);

  const getCountryEmoji = useCallback((countryCode) => {
    if (!countryCode) return '🌍';
    try {
      const code = countryCode.toUpperCase();
      // Convert country code to flag emoji
      const flagEmoji = code
        .split('')
        .map(char => String.fromCodePoint(127397 + char.charCodeAt()))
        .join('');
      console.log(`Converting country code ${code} to flag emoji: ${flagEmoji}`);
      return flagEmoji;
    } catch (error) {
      console.error('Error generating flag:', error);
      return '🌍';
    }
  }, []);

  const handleCall = useCallback(() => {
    if (!socketRef.current) return;
    setIsSearching(true);
    socketRef.current.emit('startCall');
    toast.info('Searching for a partner...', { toastId: 'searchStatus' });
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('callStarted', (data) => {
      console.log('Call started with data:', data);
      setIsInCall(true);
      setIsSearching(false);
      setPartnerCountry(data.targetCountry);
      const flag = getCountryEmoji(data.targetCountry);
      console.log(`Partner country: ${data.targetCountry}, Flag: ${flag}`);
      toast.success(`Partner found! ${flag}`);
    });

    return () => {
      socket.off('callStarted');
    };
  }, [socket, setIsInCall, getCountryEmoji]);

  return (
    <ChatContainer>
      <CallSection>
        <LogoText>
          Air<span>Speak</span>
        </LogoText>
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
          {isInCall && partnerCountry ? (
            <>
              <span>Your partner is from</span>
              <span style={{ fontSize: '2rem', lineHeight: 1 }}>{getCountryEmoji(partnerCountry)}</span>
            </>
          ) : isSearching ? (
            'Searching for partner...'
          ) : (
            'Start a new call'
          )}
        </Typography>
        
        <ActionButtons>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ActionButton 
              onClick={handleCall}
              sx={isSearching ? {
                backgroundColor: '#FF4B4B',
                '&:hover': {
                  backgroundColor: '#E53E3E'
                },
                marginRight: '16px'
              } : {}}
            >
              {isSearching ? <CallIcon sx={{ transform: 'rotate(135deg)' }} /> : <CallIcon />}
            </ActionButton>

            <ActionButton 
              onClick={() => setIsMuted(!isMuted)} 
              active={isMuted}
              sx={{ marginRight: '16px' }}
            >
              {isMuted ? <MicOffIcon /> : <MicIcon />}
            </ActionButton>
          </Box>
        </ActionButtons>
      </CallSection>
    </ChatContainer>
  );
};

export default ChatInterface;
