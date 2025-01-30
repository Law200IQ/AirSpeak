const mongoose = require('mongoose');

const callSchema = new mongoose.Schema({
    participants: [{
        type: String,  // socket IDs
        required: true
    }],
    participantCountries: [{
        type: String,  // country codes
        required: true
    }],
    startTime: {
        type: Date,
        required: true,
        default: Date.now
    },
    endTime: {
        type: Date
    },
    duration: {
        type: Number  // in seconds
    },
    status: {
        type: String,
        enum: ['ongoing', 'completed', 'missed'],
        default: 'ongoing'
    }
});

module.exports = mongoose.model('Call', callSchema);
