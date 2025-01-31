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
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 10000,
    extraHeaders: {
      'Access-Control-Allow-Origin': '*'
    }
  });

  // Add connection event handlers
  socketInstance.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  socketInstance.on('connect_timeout', () => {
    console.error('Socket connection timeout');
  });

  return { socket: socketInstance, isConnected: socketInstance.connected };
};

const { socket, isConnected } = createSocket();

export { socket as default, isConnected };
