import React, { useEffect, useState, useRef } from 'react';
import { Box, Button, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import CallIcon from '@mui/icons-material/Call';
import CallEndIcon from '@mui/icons-material/CallEnd';
import socket from '../utils/socket';
import Peer from 'simple-peer';

// Version 2.0.0 - Complete rewrite for better reliability
const Container = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: '20px',
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  color: 'white',
});

const Title = styled('h1')({
  fontSize: '2.5rem',
  marginBottom: '2rem',
  '& span': {
    color: '#FFD700',
  },
});

const Controls = styled(Box)({
  display: 'flex',
  gap: '1rem',
  marginTop: '2rem',
});

const VoiceChat = () => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const peerRef = useRef();
  const localAudioRef = useRef();
  const remoteAudioRef = useRef();

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      console.log('Connected to server');
      toast.success('Connected to server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      toast.error('Disconnected from server');
      handleEndCall();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const getMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      setLocalStream(stream);
      if (localAudioRef.current) {
        localAudioRef.current.srcObject = stream;
      }
      toast.success('Microphone access granted');
      return stream;
    } catch (err) {
      console.error('Error accessing microphone:', err);
      toast.error('Please allow microphone access');
      return null;
    }
  };

  const createPeer = (initiator) => {
    if (!localStream) return null;

    const peer = new Peer({
      initiator,
      stream: localStream,
      trickle: false,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      }
    });

    peer.on('signal', data => {
      console.log('Sending signal');
      socket.emit('signal', { signal: data });
    });

    peer.on('stream', stream => {
      console.log('Received remote stream');
      setRemoteStream(stream);
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = stream;
        toast.success('Connected to peer');
      }
    });

    peer.on('error', err => {
      console.error('Peer error:', err);
      toast.error('Connection error');
      handleEndCall();
    });

    return peer;
  };

  const handleStartCall = async () => {
    if (!localStream) {
      const stream = await getMicrophone();
      if (!stream) return;
    }

    socket.emit('ready');
    toast.info('Waiting for someone to join...');
  };

  const handleEndCall = () => {
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    setIsInCall(false);
    setRemoteStream(null);
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
    }
    toast.info('Call ended');
  };

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
      toast.info(audioTrack.enabled ? 'Microphone unmuted' : 'Microphone muted');
    }
  };

  useEffect(() => {
    getMicrophone();

    socket.on('ready', async () => {
      console.log('Someone is ready to call');
      const peer = createPeer(true);
      if (peer) {
        peerRef.current = peer;
        setIsInCall(true);
        toast.info('Connecting to peer...');
      }
    });

    socket.on('signal', data => {
      console.log('Received signal');
      if (peerRef.current) {
        peerRef.current.signal(data.signal);
      } else {
        const peer = createPeer(false);
        if (peer) {
          peer.signal(data.signal);
          peerRef.current = peer;
          setIsInCall(true);
          toast.info('Connecting to peer...');
        }
      }
    });

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      handleEndCall();
    };
  }, [localStream]);

  return (
    <Container>
      <Title>
        Air<span>Speak</span>
      </Title>

      <audio ref={localAudioRef} autoPlay muted />
      <audio ref={remoteAudioRef} autoPlay />

      <Controls>
        <IconButton
          onClick={toggleMute}
          disabled={!localStream}
          sx={{
            backgroundColor: isMuted ? 'error.main' : 'success.main',
            color: 'white',
            '&:hover': {
              backgroundColor: isMuted ? 'error.dark' : 'success.dark',
            },
          }}
        >
          {isMuted ? <MicOffIcon /> : <MicIcon />}
        </IconButton>

        <IconButton
          onClick={isInCall ? handleEndCall : handleStartCall}
          disabled={!localStream}
          sx={{
            backgroundColor: isInCall ? 'error.main' : 'success.main',
            color: 'white',
            '&:hover': {
              backgroundColor: isInCall ? 'error.dark' : 'success.dark',
            },
          }}
        >
          {isInCall ? <CallEndIcon /> : <CallIcon />}
        </IconButton>
      </Controls>
    </Container>
  );
};

export default VoiceChat;
