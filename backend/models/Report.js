const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    callId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Call',
        required: true
    },
    reportedBy: {
        type: String,  // socket ID of reporter
        required: true
    },
    reportedUser: {
        type: String,  // socket ID of reported user
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'resolved'],
        default: 'pending'
    }
});

module.exports = mongoose.model('Report', reportSchema);
