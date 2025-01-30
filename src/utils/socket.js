import { io } from 'socket.io-client';

const ENDPOINT = 'https://airspeak.onrender.com';

const socket = io(ENDPOINT, {
  transports: ['websocket'],
  secure: true,
  rejectUnauthorized: false,
  withCredentials: true,
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
  forceNew: true,
  path: '/socket.io',
  extraHeaders: {
    'Access-Control-Allow-Private-Network': 'true'
  }
});

// Connection event handlers
socket.on('connect', () => {
  console.log('Connected to server:', socket.id);
  socket.emit('join');
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
});

// Error handling
socket.on('error', (error) => {
  console.error('Socket error:', error);
});

socket.on('reconnect_attempt', (attemptNumber) => {
  console.log('Attempting to reconnect:', attemptNumber);
});

socket.on('reconnect', (attemptNumber) => {
  console.log('Reconnected after', attemptNumber, 'attempts');
});

export default socket;
