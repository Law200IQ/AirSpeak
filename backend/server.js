const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const geoip = require('geoip-lite');
const connectDB = require('./config/db');
require('dotenv').config();

// Import models
const Call = require('./models/Call');
const Report = require('./models/Report');
const UserPreference = require('./models/UserPreference');
const CountryPreference = require('./models/CountryPreference');

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: true,
  credentials: true
}));

const server = http.createServer(app);

// Socket.IO setup with more permissive CORS
const io = socketIo(server, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    credentials: true,
    transports: ['websocket', 'polling']
  },
  allowEIO3: true // Allow Engine.IO version 3
});

// Basic health check route
app.get('/', (req, res) => {
  res.send('AirSpeak Backend is running');
});

// Connect to MongoDB
connectDB();

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} from ${req.ip}`);
  next();
});

app.use(express.json());

// Store active users and their preferences
const activeUsers = new Map();
// Store users actively searching for calls
const searchingUsers = new Map();
// Cache for IP geolocation results
const geoCache = new Map();

// Helper function to get country from IP
const getCountryFromIP = (ip) => {
  try {
    // Remove IPv6 prefix if present
    const cleanIP = ip.replace(/^::ffff:/, '');
    
    // For development/localhost
    if (cleanIP === '127.0.0.1' || cleanIP === '::1') {
      return 'US';  // Default to US for local testing
    }

    // Lookup location
    const geo = geoip.lookup(cleanIP);
    if (!geo || !geo.country) {
      console.log(`No country found for IP: ${cleanIP}`);
      return 'UN';
    }

    console.log(`Found country ${geo.country} for IP: ${cleanIP}`);
    return geo.country;
  } catch (error) {
    console.error(`Error getting country from IP ${ip}:`, error);
    return 'UN';
  }
};

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);
  
  const userIP = socket.handshake.address;
  const userCountry = getCountryFromIP(userIP);
  console.log(`New connection from ${userIP} (${userCountry})`);

  socket.on('join', () => {
    console.log('User joined:', socket.id);
    activeUsers.set(socket.id, {
      socketId: socket.id,
      country: userCountry,
      busy: false,
      lastActivity: Date.now()
    });
    console.log(`User ${socket.id} joined from ${userCountry}`);
  });

  socket.on('startCall', async () => {
    const user = activeUsers.get(socket.id);
    if (!user || user.busy) return;

    // Add user to searching queue
    searchingUsers.set(socket.id, {
      ...user,
      searchStartTime: Date.now()
    });

    // Try to find a waiting partner
    const partner = findWaitingPartner(socket);
    if (partner) {
      // Found a partner, connect them
      const callId = Date.now().toString();
      
      // Update both users' status
      activeUsers.get(socket.id).busy = true;
      activeUsers.get(partner.socketId).busy = true;
      
      // Remove both from searching queue
      searchingUsers.delete(socket.id);
      searchingUsers.delete(partner.socketId);

      console.log('Matching users:', {
        user1: { id: socket.id, country: user.country },
        user2: { id: partner.socketId, country: partner.country }
      });

      // Notify both users
      io.to(socket.id).emit('callStarted', {
        callId,
        targetId: partner.socketId,
        targetCountry: partner.country
      });
      io.to(partner.socketId).emit('callStarted', {
        callId,
        targetId: socket.id,
        targetCountry: user.country
      });

      // Save call to database
      await new Call({
        callId,
        participants: [socket.id, partner.socketId],
        startTime: new Date(),
        countries: [user.country, partner.country]
      }).save();
    } else {
      // No partner available, notify user they're in queue
      socket.emit('searchStatus', {
        status: 'searching',
        message: 'Searching for a partner who started a call...',
        timestamp: Date.now()
      });

      // Set a timeout to check if still searching after 60 seconds
      setTimeout(() => {
        if (searchingUsers.has(socket.id)) {
          socket.emit('searchTimeout', {
            message: 'No partners available. Keep waiting?'
          });
        }
      }, 60000);
    }
  });

  socket.on('stopSearching', () => {
    searchingUsers.delete(socket.id);
    socket.emit('searchStopped');
  });

  socket.on('continueSearching', () => {
    const user = activeUsers.get(socket.id);
    if (user && !user.busy) {
      searchingUsers.set(socket.id, {
        ...user,
        searchStartTime: Date.now()
      });
      socket.emit('searchStatus', {
        status: 'searching',
        message: 'Continuing to search for a partner...',
        timestamp: Date.now()
      });
    }
  });

  socket.on('disconnect', () => {
    const user = activeUsers.get(socket.id);
    if (user) {
      // Clean up user data
      activeUsers.delete(socket.id);
      searchingUsers.delete(socket.id);
      
      // Notify partner if in call
      if (user.busy) {
        const partner = Array.from(activeUsers.values()).find(u => 
          u.busy && u.currentPartner === socket.id
        );
        if (partner) {
          io.to(partner.socketId).emit('callEnded');
          activeUsers.get(partner.socketId).busy = false;
        }
      }
    }
  });

  socket.on('message', (message) => {
    const user = activeUsers.get(socket.id);
    if (user && user.busy) {
      // Find the other participant in the call
      const otherUser = Array.from(activeUsers.values()).find(u => 
        u.busy && u.socketId !== socket.id
      );
      if (otherUser) {
        // Send the message to the other participant
        io.to(otherUser.socketId).emit('message', message);
      }
    }
  });

  socket.on('muteAudio', (muted) => {
    const user = activeUsers.get(socket.id);
    if (user && user.busy) {
      // Find the other participant in the call
      const otherUser = Array.from(activeUsers.values()).find(u => 
        u.busy && u.socketId !== socket.id
      );
      if (otherUser) {
        io.to(otherUser.socketId).emit('peerMuted', muted);
      }
    }
  });

  socket.on('reportUser', async ({ targetId, callId }) => {
    try {
      const report = new Report({
        callId,
        reportedBy: socket.id,
        reportedUser: targetId
      });
      await report.save();
      socket.emit('reportSubmitted');
    } catch (error) {
      console.error('Error submitting report:', error);
      socket.emit('reportError');
    }
  });

  socket.on('endCall', async ({ targetId, callId }) => {
    try {
      if (callId) {
        const call = await Call.findById(callId);
        if (call) {
          call.endTime = new Date();
          call.duration = (call.endTime - call.startTime) / 1000; // duration in seconds
          call.status = 'completed';
          await call.save();
        }
      }

      if (activeUsers.has(socket.id)) {
        activeUsers.get(socket.id).busy = false;
      }
      if (targetId && activeUsers.has(targetId)) {
        activeUsers.get(targetId).busy = false;
      }
      if (targetId) {
        io.to(targetId).emit('callEnded');
      }
    } catch (error) {
      console.error('Error ending call:', error);
    }
  });
});

const findWaitingPartner = (socket) => {
  const user = activeUsers.get(socket.id);
  if (!user) return null;

  // Find the first user who is actively searching (first in, first out)
  for (const [searcherId, searcher] of searchingUsers) {
    if (searcherId !== socket.id && !searcher.busy) {
      return searcher;
    }
  }
  return null;
};

const PORT = process.env.PORT || 10000;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
