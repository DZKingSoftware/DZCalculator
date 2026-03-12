const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const User = require('./moduls/Users');
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'https://dz-calculator.netlify.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Environment Variables
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;
const JWT_SECRET = process.env.JWT_SECRET;

// MongoDB Connection
mongoose.connect(MONGO_URL)
    .then(() => console.log('✅ Mongo-DB Connected'))
    .catch((err) => console.log('❌ MongoDB Error', err));

// --- API ROUTES ---

// Admin: Foydalanuvchi yaratish (Bot orqali chaqiriladi)
app.post('/api/admin/create-user', async (req, res) => {
    try {
        const { name, maxDevices } = req.body;
        const loginToken = crypto.randomBytes(4).toString('hex');
        const passwordToken = crypto.randomBytes(4).toString('hex');

        const newUser = new User({
            name,
            loginToken,
            passwordToken,
            maxDevices: Number(maxDevices || 1),
            usedDevices: []
        });

        await newUser.save();
        res.status(201).json({ name, loginToken, passwordToken, maxDevices: newUser.maxDevices });
    } catch (error) {
        res.status(500).json({ message: 'Serverda Xatolik!', error: error.message });
    }
});

// Login: Foydalanuvchi kirishi
app.post('/api/login', async (req, res) => {
    try {
        const { loginToken, passwordToken, deviceId } = req.body;

        if (!deviceId) {
            return res.status(400).json({ message: 'Bunday Qurulma Yoq' });
        }

        const user = await User.findOne({ loginToken, passwordToken });
        if (!user) {
            return res.status(401).json({ message: `Token No'to'g'ri` });
        }

        const isAlreadyRegistered = user.usedDevices.includes(deviceId);

        if (!isAlreadyRegistered) {
            if (user.usedDevices.length >= user.maxDevices) {
                return res.status(403).json({ message: `Limit To'lgan` });
            }
            user.usedDevices.push(deviceId);
            await user.save();
        }

        const token = jwt.sign(
            { userId: user._id, name: user.name },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.json({
            success: true,
            name: user.name,
            token: token
        });
    } catch (error) {
        res.status(500).json({ message: 'Xatolik Yuz Berdi!', error: error.message });
    }
});

// Telegram Botni ishga tushirish (bot.js fayli mavjud bo'lsa)
try {
    require('./tgbot/bot'); 
} catch (e) {
    console.log("⚠️ Bot fayli topilmadi, faqat API ishga tushmoqda.");
}

// Serverni tinglash
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server ${PORT}-portda ishga tushdi`);
});