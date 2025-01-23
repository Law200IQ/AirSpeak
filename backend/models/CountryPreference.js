const mongoose = require('mongoose');

const countryPreferenceSchema = new mongoose.Schema({
    socketId: {
        type: String,
        required: true,
        unique: true
    },
    preferredCountries: [{
        type: String  // country codes
    }],
    nonPreferredCountries: [{
        type: String  // country codes
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('CountryPreference', countryPreferenceSchema);
