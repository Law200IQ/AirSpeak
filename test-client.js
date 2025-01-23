const { io } = require('socket.io-client');

console.log('Starting test client...');

const socket = io('http://localhost:5001', {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: Infinity,
    transports: ['websocket', 'polling']
});

// Track connection state
socket.on('connect', () => {
    console.log('Connected to server as:', socket.id);
    socket.emit('join', { country: 'US' });
    console.log('Joined as available user');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on('error', (error) => {
    console.error('Socket error:', error);
});

socket.on('callStarted', (data) => {
    console.log('Received call from:', data);
    socket.emit('callAccepted', { callId: data.callId });
    console.log('Accepted call');
});

socket.on('callEnded', () => {
    console.log('Call ended');
});

socket.on('countryDetected', (country) => {
    console.log('Country detected:', country);
});

// Handle errors
socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
});

// Keep the process running
setInterval(() => {
    if (socket.connected) {
        console.log('Still connected as:', socket.id);
        console.log('Socket state:', socket.connected ? 'connected' : 'disconnected');
    }
}, 5000);

process.on('SIGINT', () => {
    console.log('Disconnecting...');
    socket.disconnect();
    process.exit();
});
