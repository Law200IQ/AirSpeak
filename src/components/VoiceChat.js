import React, { useEffect, useState, useRef } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Container,
} from '@mui/material';
import { toast } from 'react-toastify';
import io from 'socket.io-client';
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
  const [socket, setSocket] = useState(null);
  const [isInCall, setIsInCall] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [micStatus, setMicStatus] = useState({ active: false, stream: null });
  const peerRef = useRef(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5001', {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect', () => {
      setSocket(newSocket);
      toast.success('Connected to server');
      // Join the socket room with user data
      newSocket.emit('join', {});
    });

    newSocket.on('connect_error', () => {
      toast.error('Could not connect to server. Please try again later.');
      setSocket(null);
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

    return () => {
      if (micStatus.stream) {
        micStatus.stream.getTracks().forEach(track => track.stop());
      }
      if (newSocket) newSocket.close();
    };
  }, []);

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
