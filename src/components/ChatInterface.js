import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Checkbox,
  Button,
  TextField,
  Paper,
} from '@mui/material';
import {
  Call as CallIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Warning as WarningIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import * as Flags from 'country-flag-icons/react/3x2';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import CallHistory from './CallHistory';
import Support from './Support';
import Report from './Report';

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

const ChatInterface = ({ micStatus, socket, isInCall, setIsInCall }) => {
  const [autoCall, setAutoCall] = useState(false);
  const [showCallHistory, setShowCallHistory] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState(null);
  const [callHistory, setCallHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [partnerCountry, setPartnerCountry] = useState(null);
  const socketRef = useRef(socket);
  const messagesEndRef = useRef(null);

  const setupSocketListeners = useCallback(() => {
    if (!socketRef.current) return;

    socketRef.current.on('message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    socketRef.current.on('searchStatus', (data) => {
      setIsSearching(true);
      toast.info(data.message, {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        toastId: 'searchStatus'
      });
    });

    socketRef.current.on('searchTimeout', (data) => {
      toast.dismiss('searchStatus');
      toast.warning(data.message, {
        autoClose: false,
        closeButton: true,
        closeOnClick: false,
        draggable: false,
        toastId: 'searchTimeout',
        action: (
          <>
            <button 
              onClick={() => {
                toast.dismiss('searchTimeout');
                socketRef.current.emit('continueSearching');
              }}
              style={{
                background: '#6C5DD3',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                marginRight: '10px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Keep Waiting
            </button>
            <button 
              onClick={() => {
                toast.dismiss('searchTimeout');
                handleCall();
              }}
              style={{
                background: '#FF4B4B',
                color: 'white',
                border: 'none',
                padding: '5px 10px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Exit
            </button>
          </>
        )
      });
    });

    socketRef.current.on('callStarted', (data) => {
      setIsInCall(true);
      setIsSearching(false);
      setPartnerCountry(data.targetCountry);
      setReportData({
        id: data.callId,
        targetId: data.targetId,
        countryCode: data.targetCountry
      });
      toast.dismiss('searchStatus');
      toast.dismiss('searchTimeout');
      toast.success(`Partner found! ${getCountryEmoji(data.targetCountry)}`);
    });

    socketRef.current.on('callEnded', () => {
      setIsInCall(false);
      setIsSearching(false);
      setReportData(null);
      toast.info('Call ended');
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('Connection error:', error);
      toast.error('Connection error. Please try again.');
      setIsSearching(false);
    });
  }, [setIsInCall, setIsSearching, setMessages, setReportData, handleCall]);

  useEffect(() => {
    if (socket) {
      socketRef.current = socket;
      setupSocketListeners();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off('callEnded');
        socketRef.current.off('noUsersAvailable');
        socketRef.current.off('searchStopped');
        socketRef.current.off('callHistory');
        socketRef.current.off('connect');
        socketRef.current.off('connect_error');
      }
    };
  }, [socket, setupSocketListeners]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAutoCallChange = (e) => {
    const enabled = e.target.checked;
    setAutoCall(enabled);
    socketRef.current?.emit('updateAutoCall', enabled);
  };

  const handleCall = () => {
    if (!socketRef.current) {
      toast.error('Not connected to server');
      return;
    }
    
    if (isInCall) {
      socketRef.current.emit('endCall', { targetId: reportData?.targetId });
      setIsInCall(false);
      setIsSearching(false);
      setReportData(null);
      toast.info('Call ended');
    } else if (isSearching) {
      setIsSearching(false);
      socketRef.current.emit('stopSearching');
      toast.info('Search stopped');
    } else {
      setIsSearching(true);
      socketRef.current.emit('startCall');
      toast.info('Searching for a partner...', {
        autoClose: false,
        closeOnClick: false,
        draggable: false
      });
    }
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleReport = () => {
    if (!socketRef.current || !reportData) {
      toast.error('Cannot report: No active call');
      return;
    }
    
    setShowReport(true);
    toast.info('Opening report dialog...');
    
    // Emit report event to server
    socketRef.current.emit('reportUser', {
      targetId: reportData.targetId,
      callId: reportData.id,
      country: reportData.countryCode
    });
    
    // End the call after reporting
    handleCall();
  };

  const handleReportSubmit = (reportData) => {
    if (!socketRef.current || !reportData) return;
    socketRef.current.emit('reportUser', {
      targetId: reportData.targetId,
      callId: reportData.id
    });
  };

  const handleSendMessage = () => {
    if (message.trim() && socketRef.current) {
      const newMessage = {
        text: message,
        sender: socketRef.current.id,
        timestamp: new Date().toISOString(),
      };
      socketRef.current.emit('message', newMessage);
      setMessages(prev => [...prev, newMessage]);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getCountryEmoji = (countryCode) => {
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
  };

  return (
    <ChatContainer>
      <CallSection>
        <LogoText>
          Air<span>Speak</span>
        </LogoText>
        <Typography variant="h6" color="white" sx={{ mb: 2 }}>
          {isInCall ? (
            <>
              Your partner is from {getCountryEmoji(partnerCountry)}
            </>
          ) : (
            'Start a new call'
          )}
        </Typography>
        
        {isSearching && (
          <Typography 
            variant="body1" 
            color="primary" 
            align="center" 
            sx={{ 
              mb: 2,
              animation: 'pulse 1.5s infinite',
              '@keyframes pulse': {
                '0%': { opacity: 0.6 },
                '50%': { opacity: 1 },
                '100%': { opacity: 0.6 }
              }
            }}
          >
            Searching for partner...
          </Typography>
        )}

        <ActionButtons>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <ActionButton 
              color="call" 
              onClick={handleCall}
              sx={isSearching || isInCall ? {
                backgroundColor: '#FF4B4B',
                '&:hover': {
                  backgroundColor: '#E53E3E'
                },
                marginRight: '16px'
              } : {
                marginRight: '16px'
              }}
            >
              {isSearching || isInCall ? <CallIcon sx={{ transform: 'rotate(135deg)' }} /> : <CallIcon />}
            </ActionButton>

            <ActionButton 
              color="mute" 
              onClick={handleMute} 
              active={isMuted}
              sx={{ marginRight: '16px' }}
            >
              {isMuted ? <MicOffIcon /> : <MicIcon />}
            </ActionButton>

            <ActionButton 
              color="report" 
              onClick={handleReport}
              disabled={!isInCall}
            >
              <WarningIcon />
            </ActionButton>
          </Box>
        </ActionButtons>

        <Controls>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Checkbox 
              checked={autoCall} 
              onChange={handleAutoCallChange}
              sx={{ 
                color: 'rgba(255, 255, 255, 0.3)',
                '&.Mui-checked': {
                  color: '#6C5DD3',
                },
              }}
            />
            <Typography variant="body2" color="text.secondary">
              Enable Auto Call
            </Typography>
          </Box>
          
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              cursor: 'pointer',
              '&:hover': { textDecoration: 'underline' }
            }}
            onClick={() => setShowCallHistory(true)}
          >
            Call History
          </Typography>

          <Button 
            onClick={() => setShowSupport(true)}
            sx={{ 
              color: '#6C5DD3',
              '&:hover': { backgroundColor: 'rgba(108, 93, 211, 0.1)' }
            }}
          >
            Support Us
          </Button>
        </Controls>
      </CallSection>

      <ChatSection>
        <MessageList>
          {messages.map((msg, index) => (
            <MessageBubble
              key={index}
              isUser={msg.sender === socketRef.current?.id}
            >
              <Typography variant="body2">{msg.text}</Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block',
                  textAlign: msg.sender === socketRef.current?.id ? 'right' : 'left',
                  opacity: 0.7,
                  mt: 0.5
                }}
              >
                {new Date(msg.timestamp).toLocaleTimeString()}
              </Typography>
            </MessageBubble>
          ))}
          <div ref={messagesEndRef} />
        </MessageList>

        <MessageInput>
          <StyledTextField
            fullWidth
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            size="small"
          />
          <SendButton onClick={handleSendMessage}>
            <SendIcon />
          </SendButton>
        </MessageInput>
      </ChatSection>

      {showCallHistory && (
        <CallHistory
          open={showCallHistory}
          onClose={() => setShowCallHistory(false)}
          history={callHistory}
        />
      )}

      {showSupport && (
        <Support
          open={showSupport}
          onClose={() => setShowSupport(false)}
        />
      )}

      {showReport && reportData && (
        <Report
          open={showReport}
          onClose={() => setShowReport(false)}
          reportData={reportData}
          onReport={handleReportSubmit}
        />
      )}
    </ChatContainer>
  );
};

export default ChatInterface;
