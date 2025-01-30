import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, IconButton, Typography, Paper, TextField } from '@mui/material';
import { Call as CallIcon, Mic as MicIcon, MicOff as MicOffIcon, Send as SendIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';

const ChatContainer = styled(Box)(({ theme }) => ({
  width: '800px',
  height: '500px',
  display: 'flex',
  backgroundColor: '#1C1C2D',
  borderRadius: '12px',
  overflow: 'hidden',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    height: '100vh',
    borderRadius: 0,
    flexDirection: 'column',
  },
}));

const CallSection = styled(Box)(({ theme }) => ({
  width: '350px',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  borderRight: '1px solid rgba(255, 255, 255, 0.1)',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    borderRight: 'none',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
}));

const ChatSection = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: '#242444',
}));

const MessageList = styled(Box)({
  flex: 1,
  padding: '16px',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(255, 255, 255, 0.05)',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '2px',
  },
});

const MessageBubble = styled(Paper)(({ isUser }) => ({
  padding: '8px 12px',
  backgroundColor: isUser ? '#6C5DD3' : 'rgba(255, 255, 255, 0.1)',
  color: '#fff',
  borderRadius: '12px',
  maxWidth: '80%',
  alignSelf: isUser ? 'flex-end' : 'flex-start',
}));

const MessageInput = styled(Box)({
  padding: '16px',
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  display: 'flex',
  gap: '8px',
});

const LogoText = styled(Typography)(({ theme }) => ({
  color: 'white',
  fontSize: '28px',
  fontWeight: 'bold',
  letterSpacing: '0.5px',
  marginBottom: '16px',
  '& span': {
    color: '#6C5DD3',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '24px',
  },
}));

const ActionButtons = styled(Box)({
  display: 'flex',
  gap: '20px',
  justifyContent: 'center',
  marginTop: '24px',
  marginBottom: '24px',
});

const ActionButton = styled(IconButton)(({ color = 'primary', active }) => ({
  backgroundColor: active ? '#FF4B4B' :
                  color === 'call' ? '#4CAF50' : 
                  color === 'mute' ? '#6C5DD3' : 
                  color === 'report' ? '#FF9800' : 
                  'rgba(255, 255, 255, 0.1)',
  color: '#fff',
  padding: '12px',
  width: '56px',
  height: '56px',
  '&:hover': {
    backgroundColor: active ? '#E53E3E' :
                    color === 'call' ? '#388E3C' : 
                    color === 'mute' ? '#5648B2' : 
                    color === 'report' ? '#F57C00' : 
                    'rgba(255, 255, 255, 0.2)',
  },
  '& .MuiSvgIcon-root': {
    fontSize: '24px',
  },
}));

const Controls = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '12px',
});

const StyledTextField = styled(TextField)({
  '& .MuiInputBase-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '24px',
    color: '#fff',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  '& .MuiInputBase-input': {
    padding: '12px 16px',
  },
});

const SendButton = styled(IconButton)({
  backgroundColor: '#6C5DD3',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#5648B2',
  },
  padding: '8px',
});

const ChatInterface = ({ socket, setIsInCall }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [partnerCountry, setPartnerCountry] = useState(null);
  const socketRef = useRef(socket);

  const getCountryEmoji = useCallback((countryCode) => {
    if (!countryCode || countryCode === 'UN') return '🌍';
    try {
      const code = countryCode.toUpperCase();
      return code
        .split('')
        .map(char => String.fromCodePoint(127397 + char.charCodeAt()))
        .join('');
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
      setIsInCall(true);
      setIsSearching(false);
      setPartnerCountry(data.targetCountry);
      toast.success(`Partner found from ${getCountryEmoji(data.targetCountry)}`);
    });
  }, []);

  return (
    <ChatContainer>
      <CallSection>
        <LogoText>
          Air<span>Speak</span>
        </LogoText>
        <Typography variant="h6" color="white" sx={{ mb: 2 }}>
          {isSearching ? (
            'Searching for partner...'
          ) : (
            'Start a new call'
          )}
        </Typography>
        
        <ActionButtons>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ActionButton 
              color="call" 
              onClick={handleCall}
              sx={isSearching ? {
                backgroundColor: '#FF4B4B',
                '&:hover': {
                  backgroundColor: '#E53E3E'
                },
                marginRight: '16px'
              } : {
                marginRight: '16px'
              }}
            >
              {isSearching ? <CallIcon sx={{ transform: 'rotate(135deg)' }} /> : <CallIcon />}
            </ActionButton>

            <ActionButton 
              color="mute" 
              onClick={() => setIsMuted(!isMuted)} 
              active={isMuted}
              sx={{ marginRight: '16px' }}
            >
              {isMuted ? <MicOffIcon /> : <MicIcon />}
            </ActionButton>
          </Box>
        </ActionButtons>

        <Controls>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Enable Auto Call
            </Typography>
          </Box>
        </Controls>
      </CallSection>

      <ChatSection>
        <MessageList>
          <div ref={socketRef} />
        </MessageList>

        <MessageInput>
          <StyledTextField
            fullWidth
            placeholder="Type a message..."
            size="small"
          />
          <SendButton>
            <SendIcon />
          </SendButton>
        </MessageInput>
      </ChatSection>
    </ChatContainer>
  );
};

export default ChatInterface;
