import { io } from 'socket.io-client';

const ENDPOINT = 'https://airspeak.onrender.com';

// Create a singleton socket instance
let socketInstance = null;

const createSocket = () => {
  if (socketInstance) {
    return socketInstance;
  }

  socketInstance = io(ENDPOINT, {
    transports: ['websocket', 'polling'],
    secure: true,
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 5000,
    path: '/socket.io',
    query: {
      timestamp: Date.now(),
      version: '1.0.0'
    }
  });

  let isConnected = false;

  // Connection event handlers
  socketInstance.on('connect', () => {
    console.log('Connected to server:', socketInstance.id);
    isConnected = true;
    socketInstance.emit('join');
    socketInstance.sendBuffer = []; // Clear any pending messages
  });

  socketInstance.on('connect_error', (error) => {
    console.error('Connection error:', error);
    isConnected = false;
    if (socketInstance.io.opts.transports.includes('websocket')) {
      console.log('Falling back to polling transport');
      socketInstance.io.opts.transports = ['polling'];
    }
  });

  socketInstance.on('disconnect', (reason) => {
    console.log('Disconnected:', reason);
    isConnected = false;
    // Reconnect on certain disconnect reasons
    if (reason === 'io server disconnect' || reason === 'transport close' || reason === 'ping timeout') {
      console.log('Attempting to reconnect...');
      setTimeout(() => socketInstance.connect(), 1000);
    }
  });

  socketInstance.on('reconnect', (attemptNumber) => {
    console.log('Reconnected after', attemptNumber, 'attempts');
    isConnected = true;
    socketInstance.emit('join');
  });

  socketInstance.on('reconnect_attempt', () => {
    console.log('Attempting to reconnect...');
    // Alternate between transport methods on each attempt
    socketInstance.io.opts.transports = 
      socketInstance.io.opts.transports[0] === 'polling' 
        ? ['websocket', 'polling']
        : ['polling', 'websocket'];
  });

  socketInstance.on('reconnect_error', (error) => {
    console.error('Reconnection error:', error);
    isConnected = false;
  });

  socketInstance.on('reconnect_failed', () => {
    console.error('Failed to reconnect');
    // Try to establish a new connection with different transport
    socketInstance.io.opts.transports = ['polling', 'websocket'];
    setTimeout(() => socketInstance.connect(), 2000);
  });

  // Keep-alive mechanism
  const keepAlive = () => {
    if (socketInstance.connected) {
      socketInstance.emit('ping');
      console.log('Sent ping to server');
    }
  };

  // Send ping every 10 seconds
  const pingInterval = setInterval(keepAlive, 10000);

  // Clean up interval on window unload
  window.addEventListener('unload', () => {
    clearInterval(pingInterval);
    if (socketInstance.connected) {
      socketInstance.disconnect();
    }
  });

  socketInstance.on('pong', () => {
    console.log('Received pong from server');
  });

  return { socket: socketInstance, isConnected };
};

const { socket, isConnected } = createSocket();

export { socket as default, isConnected };
