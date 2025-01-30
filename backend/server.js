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

// List of all country codes
const ALL_COUNTRIES = [
  'AF', 'AX', 'AL', 'DZ', 'AS', 'AD', 'AO', 'AI', 'AQ', 'AG', 'AR', 'AM', 'AW', 'AU', 'AT', 'AZ',
  'BS', 'BH', 'BD', 'BB', 'BY', 'BE', 'BZ', 'BJ', 'BM', 'BT', 'BO', 'BQ', 'BA', 'BW', 'BV', 'BR',
  'IO', 'BN', 'BG', 'BF', 'BI', 'KH', 'CM', 'CA', 'CV', 'KY', 'CF', 'TD', 'CL', 'CN', 'CX', 'CC',
  'CO', 'KM', 'CG', 'CD', 'CK', 'CR', 'CI', 'HR', 'CU', 'CW', 'CY', 'CZ', 'DK', 'DJ', 'DM', 'DO',
  'EC', 'EG', 'SV', 'GQ', 'ER', 'EE', 'ET', 'FK', 'FO', 'FJ', 'FI', 'FR', 'GF', 'PF', 'TF', 'GA',
  'GM', 'GE', 'DE', 'GH', 'GI', 'GR', 'GL', 'GD', 'GP', 'GU', 'GT', 'GG', 'GN', 'GW', 'GY', 'HT',
  'HM', 'VA', 'HN', 'HK', 'HU', 'IS', 'IN', 'ID', 'IR', 'IQ', 'IE', 'IM', 'IL', 'IT', 'JM', 'JP',
  'JE', 'JO', 'KZ', 'KE', 'KI', 'KP', 'KR', 'KW', 'KG', 'LA', 'LV', 'LB', 'LS', 'LR', 'LY', 'LI',
  'LT', 'LU', 'MO', 'MK', 'MG', 'MW', 'MY', 'MV', 'ML', 'MT', 'MH', 'MQ', 'MR', 'MU', 'YT', 'MX',
  'FM', 'MD', 'MC', 'MN', 'ME', 'MS', 'MA', 'MZ', 'MM', 'NA', 'NR', 'NP', 'NL', 'NC', 'NZ', 'NI',
  'NE', 'NG', 'NU', 'NF', 'MP', 'NO', 'OM', 'PK', 'PW', 'PS', 'PA', 'PG', 'PY', 'PE', 'PH', 'PN',
  'PL', 'PT', 'PR', 'QA', 'RE', 'RO', 'RU', 'RW', 'BL', 'SH', 'KN', 'LC', 'MF', 'PM', 'VC', 'WS',
  'SM', 'ST', 'SA', 'SN', 'RS', 'SC', 'SL', 'SG', 'SX', 'SK', 'SI', 'SB', 'SO', 'ZA', 'GS', 'SS',
  'ES', 'LK', 'SD', 'SR', 'SJ', 'SZ', 'SE', 'CH', 'SY', 'TW', 'TJ', 'TZ', 'TH', 'TL', 'TG', 'TK',
  'TO', 'TT', 'TN', 'TR', 'TM', 'TC', 'TV', 'UG', 'UA', 'AE', 'GB', 'US', 'UM', 'UY', 'UZ', 'VU',
  'VE', 'VN', 'VG', 'VI', 'WF', 'EH', 'YE', 'ZM', 'ZW'
];

// Helper function to get country from IP
const getCountryFromIP = (ip) => {
  if (!ip) return null;
  
  try {
    // Split IP string and get the first real IP
    const ips = ip.split(',').map(ip => ip.trim());
    // Get the first non-private IP from the list
    const realIP = ips.find(ip => {
      return !ip.startsWith('10.') && 
             !ip.startsWith('172.') && 
             !ip.startsWith('192.168.') &&
             ip !== '127.0.0.1' &&
             ip !== '::1';
    });

    if (!realIP) {
      console.log('No public IP found:', ips);
      return null;
    }

    // Remove IPv6 prefix if present
    const cleanIP = realIP.replace(/^::ffff:/, '');
    console.log('Using IP:', cleanIP);

    // Get geolocation data
    const geo = geoip.lookup(cleanIP);
    console.log('Geolocation result:', geo);

    if (!geo || !geo.country) {
      console.log('No country found for IP:', cleanIP);
      return null;
    }

    const country = geo.country.toUpperCase();
    console.log('Detected country:', country);
    return country;
  } catch (error) {
    console.error('Error in getCountryFromIP:', error);
    return null;
  }
};

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);
  
  // Try to get the real IP from headers first
  const userIP = socket.handshake.headers['x-forwarded-for'] || 
                 socket.handshake.headers['x-real-ip'] || 
                 socket.handshake.address;
                 
  console.log('Connection headers:', {
    forwarded: socket.handshake.headers['x-forwarded-for'],
    real: socket.handshake.headers['x-real-ip'],
    direct: socket.handshake.address
  });

  let country = null;

  // First try Cloudflare country header
  if (socket.handshake.headers['cf-ipcountry']) {
    country = socket.handshake.headers['cf-ipcountry'].toUpperCase();
    console.log('Got country from CF header:', country);
  }

  // If no CF country, try each IP source
  if (!country) {
    const ipSources = [userIP].filter(Boolean);
    for (const ipSource of ipSources) {
      country = getCountryFromIP(ipSource);
      if (country) {
        console.log('Got country from IP:', ipSource, country);
        break;
      }
    }
  }

  console.log(`Final country detection for ${socket.id}:`, country || 'not detected');

  socket.on('join', () => {
    if (country) {
      activeUsers.set(socket.id, {
        socketId: socket.id,
        country: country,
        busy: false,
        lastActivity: Date.now()
      });
      socket.emit('countryDetected', { country });
      console.log('Sent country to user:', country);
    } else {
      console.log('No country detected for user:', socket.id);
    }
  });

  socket.on('startCall', async () => {
    console.log('User starting call:', socket.id);
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

      // Notify both users with their partner's country
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
