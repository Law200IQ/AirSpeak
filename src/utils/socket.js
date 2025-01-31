import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

const ENDPOINT = process.env.NODE_ENV === 'production' 
  ? 'https://airspeak-backend.onrender.com'
  : 'http://localhost:10000';

// Create a singleton socket instance
let socketInstance = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

const createSocket = () => {
  if (socketInstance) {
    return socketInstance;
  }

  socketInstance = io(ENDPOINT, {
    transports: ['websocket', 'polling'],
    secure: true,
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: MAX_RECONNECT_ATTEMPTS,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 10000,
    timeout: 20000,
    withCredentials: true,
    extraHeaders: {
      'Access-Control-Allow-Origin': 'https://law200iq.github.io',
      'Access-Control-Allow-Credentials': 'true'
    }
  });

  // Add connection event handlers
  socketInstance.on('connect', () => {
    console.log('Connected to server');
    reconnectAttempts = 0;
    toast.success('Connected to server');
  });

  socketInstance.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
    reconnectAttempts++;
    
    if (reconnectAttempts === 1) {
      toast.info('Server is starting up, please wait...', {
        autoClose: 10000
      });
    } else if (error.message.includes('CORS')) {
      toast.error('CORS error - Please check server configuration');
      console.error('CORS Error Details:', error);
    }
    
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      toast.error('Unable to connect to server. Please try again later.');
      socketInstance.disconnect();
    }
  });

  socketInstance.on('connect_timeout', () => {
    console.error('Socket connection timeout');
    toast.error('Connection timeout. Server might be starting up...');
  });

  // Keep alive ping to prevent server from sleeping
  setInterval(() => {
    if (socketInstance.connected) {
      socketInstance.emit('ping');
    }
  }, 50000);

  return { socket: socketInstance, isConnected: socketInstance.connected };
};

const { socket, isConnected } = createSocket();

export { socket as default, isConnected };
