import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Button, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import Peer from 'simple-peer';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import socket from '../utils/socket';

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

const ChatInterface = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [partnerCountry, setPartnerCountry] = useState(null);
  const [micStatus, setMicStatus] = useState({ active: false, stream: null });
  const peerRef = useRef(null);
  const audioRef = useRef(null);

  const initializeMicrophone = useCallback(async () => {
    try {
      console.log('Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1
        }
      });

      console.log('Microphone access granted');
      setMicStatus({ active: true, stream });
      toast.success('Microphone connected successfully');
    } catch (err) {
      console.error('Microphone access error:', err);
      setMicStatus({ active: false, stream: null });
      toast.error('Please allow microphone access to use the app');
    }
  }, []);

  const initializePeer = useCallback((initiator = false) => {
    if (!micStatus.stream) {
      toast.error('Microphone access is required');
      return null;
    }

    try {
      console.log('Initializing peer connection:', { initiator });
      const peer = new Peer({
        initiator,
        stream: micStatus.stream,
        trickle: true,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            {
              urls: 'turn:openrelay.metered.ca:80',
              username: 'openrelayproject',
              credential: 'openrelayproject'
            },
            {
              urls: 'turn:openrelay.metered.ca:443',
              username: 'openrelayproject',
              credential: 'openrelayproject'
            }
          ]
        }
      });

      peer.on('signal', data => {
        console.log('Generated signal data');
        socket.emit('webrtc-signal', {
          signal: data,
          targetId: socket.targetId
        });
      });

      peer.on('stream', stream => {
        console.log('Received remote stream');
        if (audioRef.current) {
          audioRef.current.srcObject = stream;
          audioRef.current.play().catch(err => {
            console.error('Error playing audio:', err);
          });
        }
      });

      peer.on('error', err => {
        console.error('Peer error:', err);
        toast.error('Connection error. Please try again.');
        cleanupCall();
      });

      peer.on('close', () => {
        console.log('Peer connection closed');
        cleanupCall();
      });

      peer.on('connect', () => {
        console.log('Peer connection established');
        toast.success('Connected to partner!');
      });

      return peer;
    } catch (error) {
      console.error('Error creating peer:', error);
      toast.error('Failed to establish connection');
      return null;
    }
  }, [micStatus.stream]);

  const handleCall = useCallback(() => {
    if (!socket || !micStatus.active) {
      toast.error('Please allow microphone access first');
      return;
    }
    
    setIsSearching(true);
    socket.emit('startCall');
    
    toast.info('Searching for a partner...', {
      position: "top-center",
      autoClose: 3000
    });
  }, [micStatus.active]);

  const cleanupCall = useCallback(() => {
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }

    if (audioRef.current) {
      audioRef.current.srcObject = null;
    }

    setIsInCall(false);
    setPartnerCountry(null);
  }, []);

  const toggleMute = useCallback(() => {
    if (micStatus.stream) {
      const audioTrack = micStatus.stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
        toast.info(audioTrack.enabled ? 'Microphone unmuted' : 'Microphone muted');
      }
    }
  }, [micStatus.stream]);

  useEffect(() => {
    if (!socket) return;

    socket.on('webrtc-signal', async ({ signal, targetId }) => {
      console.log('Received signal');
      
      if (!peerRef.current) {
        console.log('Creating new peer for incoming signal');
        const peer = initializePeer(false);
        if (!peer) return;
        peerRef.current = peer;
      }

      try {
        peerRef.current.signal(signal);
      } catch (error) {
        console.error('Error handling signal:', error);
        cleanupCall();
      }
    });

    socket.on('callStarted', ({ targetId, targetCountry }) => {
      console.log('Call started:', { targetId, targetCountry });
      socket.targetId = targetId;

      if (targetCountry) {
        try {
          const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
          const name = regionNames.of(targetCountry);
          const flag = targetCountry
            .toUpperCase()
            .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt()));
          setPartnerCountry({ name, flag });
        } catch (error) {
          console.error('Error getting country name:', error);
        }
      }

      const peer = initializePeer(true);
      if (peer) {
        peerRef.current = peer;
        setIsInCall(true);
        setIsSearching(false);
      }
    });

    socket.on('callEnded', () => {
      console.log('Call ended');
      cleanupCall();
      toast.info('Call ended');
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
      socket.off('webrtc-signal');
      socket.off('callStarted');
      socket.off('callEnded');
      socket.off('noPartnerFound');
      cleanupCall();
    };
  }, [initializePeer, cleanupCall]);

  useEffect(() => {
    initializeMicrophone();
    socket.connect();

    return () => {
      if (micStatus.stream) {
        micStatus.stream.getTracks().forEach(track => {
          track.stop();
          console.log('Stopped track:', track.kind);
        });
      }
      socket.disconnect();
    };
  }, [initializeMicrophone, micStatus.stream]);

  return (
    <ChatContainer>
      <audio 
        ref={audioRef} 
        autoPlay 
        playsInline 
      />
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCall}
              disabled={isSearching || !micStatus.active}
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
            <IconButton
              onClick={toggleMute}
              disabled={!micStatus.active}
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.2)'
                }
              }}
            >
              {isMuted ? <MicOffIcon /> : <MicIcon />}
            </IconButton>
          </Box>
        </ActionButtons>
      </CallSection>
    </ChatContainer>
  );
};

export default ChatInterface;
