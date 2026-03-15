const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    loginToken: String,
    passwordToken: String,
    maxDevices: Number,
    usedDevices: [String],
    expiresAt: { type: Date, index: { expires: 0 } }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);