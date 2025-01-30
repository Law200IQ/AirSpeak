import { io } from 'socket.io-client';

// Use wss for secure WebSocket connection
const ENDPOINT = 'wss://airspeak.onrender.com';

const socket = io(ENDPOINT, {
  // Start with WebSocket, fallback to polling
  transports: ['websocket', 'polling'],
  // Basic options
  secure: true,
  autoConnect: false,
  // Reconnection settings
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 500,
  reconnectionDelayMax: 2000,
  randomizationFactor: 0.5,
  // Timeout settings
  timeout: 5000,
  // Connection settings
  upgrade: true,
  rememberUpgrade: true,
  forceNew: true,
  // Ping settings
  pingInterval: 10000,
  pingTimeout: 5000
});

// Connection event handlers
socket.on('connect', () => {
  console.log('Connected to server:', socket.id);
  socket.emit('join');
  socket.sendBuffer = []; // Clear any pending messages
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
  // Try polling if websocket fails
  if (socket.io.opts.transports[0] === 'websocket') {
    console.log('Falling back to polling transport');
    socket.io.opts.transports = ['polling', 'websocket'];
  }
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
  // Reconnect on certain disconnect reasons
  if (reason === 'io server disconnect' || reason === 'transport close' || reason === 'ping timeout') {
    console.log('Attempting to reconnect...');
    setTimeout(() => socket.connect(), 1000);
  }
});

socket.on('reconnect', (attemptNumber) => {
  console.log('Reconnected after', attemptNumber, 'attempts');
  socket.emit('join');
});

socket.on('reconnect_attempt', () => {
  console.log('Attempting to reconnect...');
  // Alternate between transport methods on each attempt
  socket.io.opts.transports = 
    socket.io.opts.transports[0] === 'polling' 
      ? ['websocket', 'polling']
      : ['polling', 'websocket'];
});

socket.on('reconnect_error', (error) => {
  console.error('Reconnection error:', error);
});

socket.on('reconnect_failed', () => {
  console.error('Failed to reconnect');
  // Try to establish a new connection with different transport
  socket.io.opts.transports = ['polling', 'websocket'];
  setTimeout(() => socket.connect(), 2000);
});

// Keep-alive mechanism
const keepAlive = () => {
  if (socket.connected) {
    socket.emit('ping');
    console.log('Sent ping to server');
  }
};

// Send ping every 10 seconds
const pingInterval = setInterval(keepAlive, 10000);

// Clean up interval on window unload
window.addEventListener('unload', () => {
  clearInterval(pingInterval);
  if (socket.connected) {
    socket.disconnect();
  }
});

socket.on('pong', () => {
  console.log('Received pong from server');
});

export default socket;
