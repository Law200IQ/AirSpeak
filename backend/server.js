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
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Connect to MongoDB
connectDB();

app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Store active users and their preferences
const activeUsers = new Map();
// Cache for IP geolocation results
const geoCache = new Map();

// Helper function to get country from IP
const getCountryFromIP = (ip) => {
  if (process.env.NODE_ENV === 'development') {
    return { code: 'US', name: 'United States' }; // Default for development
  }
  
  // Remove IPv6 prefix if present
  const cleanIP = ip.replace(/^::ffff:/, '');
  
  // Check cache first
  if (geoCache.has(cleanIP)) {
    return geoCache.get(cleanIP);
  }

  // Lookup location
  const geo = geoip.lookup(cleanIP);
  const country = geo ? {
    code: geo.country,
    name: geo.country
  } : {
    code: 'UN',
    name: 'Unknown'
  };

  // Cache the result
  geoCache.set(cleanIP, country);
  return country;
};

// Helper function to find matching user based on preferences
const findMatchingUser = async (socket, preferences, attemptNumber = 1) => {
  const user = activeUsers.get(socket.id);
  if (!user) return null;

  // Get user's country preferences
  const countryPrefs = await CountryPreference.findOne({ socketId: socket.id });
  
  // Filter available users
  let availableUsers = Array.from(activeUsers.values()).filter(u => 
    !u.busy && u.socketId !== socket.id
  );

  console.log(`Attempt ${attemptNumber}: Found ${availableUsers.length} available users`);

  // Apply country filters based on attempt number
  if (attemptNumber === 1 && countryPrefs?.preferredCountries?.length > 0) {
    // First attempt: Strict matching with preferred countries
    availableUsers = availableUsers.filter(u => 
      countryPrefs.preferredCountries.includes(u.country)
    );
    console.log(`After preferred countries filter: ${availableUsers.length} users`);
  } else if (attemptNumber === 2 && countryPrefs?.nonPreferredCountries?.length > 0) {
    // Second attempt: Match with any country except non-preferred
    availableUsers = availableUsers.filter(u => 
      !countryPrefs.nonPreferredCountries.includes(u.country)
    );
    console.log(`After non-preferred countries filter: ${availableUsers.length} users`);
  }
  // Third attempt: Global matching with non-preferred exclusion
  else if (attemptNumber === 3 && countryPrefs?.nonPreferredCountries?.length > 0) {
    availableUsers = availableUsers.filter(u => 
      !countryPrefs.nonPreferredCountries.includes(u.country)
    );
    console.log(`After global matching: ${availableUsers.length} users`);
  }

  if (availableUsers.length === 0) {
    return null;
  }

  return availableUsers[Math.floor(Math.random() * availableUsers.length)];
};

// API Routes
app.get('/api/call-history/:socketId', async (req, res) => {
  try {
    const calls = await Call.find({
      participants: req.params.socketId
    }).sort({ startTime: -1 });
    res.json(calls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  socket.on('join', async (userData) => {
    console.log('User joined:', socket.id, userData);
    const country = userData.country || getCountryFromIP(socket.handshake.address);
    activeUsers.set(socket.id, {
      socketId: socket.id,
      country: country.code,
      busy: false
    });
    console.log('Active users after join:', Array.from(activeUsers.keys()));
    
    // Create or update user preferences
    await UserPreference.findOneAndUpdate(
      { socketId: socket.id },
      { 
        lastActive: new Date(),
        country: country.code
      },
      { upsert: true }
    );
    
    // Send country info back to the user
    socket.emit('countryDetected', country);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    activeUsers.delete(socket.id);
    console.log('Active users after disconnect:', Array.from(activeUsers.keys()));
  });

  socket.on('updateAutoCall', async (enabled) => {
    try {
      await UserPreference.findOneAndUpdate(
        { socketId: socket.id },
        { autoCallEnabled: enabled },
        { upsert: true }
      );
    } catch (error) {
      console.error('Error updating auto call preference:', error);
    }
  });

  socket.on('updateCountryPreferences', async ({ preferred, nonPreferred }) => {
    try {
      console.log('Updating country preferences for socket:', socket.id);
      console.log('Preferred countries:', preferred);
      console.log('Non-preferred countries:', nonPreferred);

      await CountryPreference.findOneAndUpdate(
        { socketId: socket.id },
        {
          preferredCountries: preferred || [],
          nonPreferredCountries: nonPreferred || [],
          lastUpdated: new Date()
        },
        { upsert: true }
      );

      console.log('Successfully updated country preferences');
      socket.emit('preferencesUpdated');
    } catch (error) {
      console.error('Error updating country preferences:', error);
      socket.emit('preferencesError');
    }
  });

  socket.on('startCall', async () => {
    try {
      console.log('Start call request from:', socket.id);
      console.log('Current active users:', Array.from(activeUsers.keys()));
      
      const caller = activeUsers.get(socket.id);
      if (!caller || caller.busy) {
        console.log('Caller is busy or not found');
        socket.emit('searchStopped');
        return;
      }

      // Try to find a match with increasingly relaxed criteria
      let match = null;
      for (let attempt = 1; attempt <= 3 && !match; attempt++) {
        console.log(`Attempting match - try ${attempt}`);
        match = await findMatchingUser(socket, {}, attempt);
        console.log('Potential matches:', Array.from(activeUsers.values())
          .filter(u => !u.busy && u.socketId !== socket.id)
          .map(u => ({ id: u.socketId, country: u.country })));
        if (match) break;
        
        // Add delay between attempts
        await new Promise(resolve => setTimeout(resolve, 3000));
      }

      if (match) {
        console.log('Match found:', match.socketId);
        
        // Create new call record
        const call = new Call({
          participants: [socket.id, match.socketId],
          participantCountries: [caller.country, match.country],
          startTime: new Date()
        });
        await call.save();
        
        // Mark both users as busy
        caller.busy = true;
        const matchedUser = activeUsers.get(match.socketId);
        if (matchedUser) {
          matchedUser.busy = true;
        } else {
          console.log('Warning: Matched user no longer active');
          socket.emit('searchStopped');
          return;
        }

        // Notify both users
        socket.emit('callStarted', {
          callId: call._id,
          targetId: match.socketId,
          targetCountry: match.country
        });
        
        io.to(match.socketId).emit('callStarted', {
          callId: call._id,
          targetId: socket.id,
          targetCountry: caller.country
        });
      } else {
        console.log('No match found for:', socket.id);
        socket.emit('noUsersAvailable');
      }
    } catch (error) {
      console.error('Error in startCall:', error);
      socket.emit('searchStopped');
    }
  });

  socket.on('stopSearching', () => {
    const user = activeUsers.get(socket.id);
    if (user) {
      user.busy = false;
    }
    socket.emit('searchStopped');
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

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
