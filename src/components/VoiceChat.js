import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { toast } from 'react-toastify';
import socket from '../utils/socket';
// Keep Peer for WebRTC functionality
// eslint-disable-next-line no-unused-vars
import Peer from 'simple-peer';
import ChatInterface from './ChatInterface';

const MainContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(180deg, #1a1a2e 0%, #16162c 100%)',
}));

const VoiceChat = () => {
  const [isInCall, setIsInCall] = useState(false);
  const [micStatus, setMicStatus] = useState({ active: false, stream: null });

  useEffect(() => {
    const newSocket = socket('https://airspeak.onrender.com', {
      transports: ['polling', 'websocket'],
      secure: true,
      rejectUnauthorized: false,
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000
    });

    newSocket.on('connect', () => {
      console.log('Connected to server with ID:', newSocket.id);
      newSocket.emit('join', {});
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      toast.error('Could not connect to server. Please try again later.');
    });

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        setMicStatus({ active: true, stream });
        toast.success('Microphone access granted');
      })
      .catch(err => {
        setMicStatus({ active: false, stream: null });
        toast.error('Microphone access is required. Please allow microphone access and refresh the page.');
      });

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (micStatus.stream) {
      const tracks = micStatus.stream.getTracks();
      return () => {
        tracks.forEach(track => track.stop());
      };
    }
  }, [micStatus.stream]);

  return (
    <MainContainer>
      <ChatInterface 
        micStatus={micStatus}
        socket={socket}
        isInCall={isInCall}
        setIsInCall={setIsInCall}
      />
    </MainContainer>
  );
};

export default VoiceChat;
