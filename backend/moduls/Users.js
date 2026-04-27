const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    loginToken: String,
    passwordToken: String,
    maxDevices: Number,
    usedDevices: [String],
    durationMinutes: Number,
    expiresAt: { type: Date, default: null },
    telegramId: { type: Number, unique: true }
});

module.exports = mongoose.model('User', userSchema);