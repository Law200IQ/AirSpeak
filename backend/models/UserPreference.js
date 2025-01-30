const mongoose = require('mongoose');

const userPreferenceSchema = new mongoose.Schema({
    socketId: {
        type: String,
        required: true,
        unique: true
    },
    autoCallEnabled: {
        type: Boolean,
        default: false
    },
    lastActive: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('UserPreference', userPreferenceSchema);
