const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    loginToken: String,
    passwordToken: String,
    maxDevices: Number,
    usedDevices: [String]
});

module.exports = mongoose.model('User', userSchema);