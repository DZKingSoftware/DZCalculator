const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
    // origin: 'https://dz-calculator.netlify.app',
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

const User = require('./moduls/Users');
const { bot } = require('./tgbot/bot');

app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;
const JWT_SECRET = process.env.JWT_SECRET;

// --- API ROUTES ---

app.post('/api/admin/create-user', async (req, res) => {
    try {
        const { name, maxDevices, durationMinutes } = req.body;

        const loginToken = crypto.randomBytes(4).toString('hex');
        const passwordToken = crypto.randomBytes(4).toString('hex');

        const expirationDate = new Date();
        expirationDate.setMinutes(expirationDate.getMinutes() + Number(durationMinutes));

        const newUser = new User({
            name,
            loginToken,
            passwordToken,
            maxDevices: Number(maxDevices || 1),
            usedDevices: [],
            expiresAt: expirationDate
        });

        await newUser.save();
        res.status(201).json({ name, loginToken, passwordToken, maxDevices: newUser.maxDevices, expiresAt: expirationDate });
    } catch (error) {
        res.status(500).json({ message: 'Serverda Xatolik!', error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    console.log(`Login So'rovi keldi`)
    try {
        const { loginToken, passwordToken, deviceId } = req.body;

        if (!deviceId) {
            return res.status(400).json({ message: 'Bunday Qurulma Yoq' });
        }

        console.log(`Bazadan Qidirilmoqda`);
        const user = await User.findOne({ loginToken, passwordToken });
        if (!user) {
            console.log(`foydalanuvchi topilmadi`)
            return res.status(401).json({ message: `Login or Password is Incorrect` });
        }

        console.log(`foydalanuvchi topildi`)
        const isAlreadyRegistered = user.usedDevices.includes(deviceId);

        if (!isAlreadyRegistered) {
            if (user.usedDevices.length >= user.maxDevices) {
                return res.status(403).json({ message: `This user has reached his Limit` });
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
            token: token,
            expiresAt: user.expiresAt
        });
    } catch (error) {
        res.status(500).json({ message: 'Error, Please try Again: ', error: error.message });
    }
});

process.once('SIGINT', () => {
    bot.stop('SIGINT');
    process.exit(0);
});
process.once('SIGTERM', () => {
    bot.stop('SIGTERM');
    process.exit(0);
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server ${PORT}-portda ishga tushdi`);

    mongoose.connect(MONGO_URL)
        .then(() => {
            console.log('✅ Mongo-DB Connected');

            bot.launch()
                .then(() => console.log('🤖 Bot ishga tushdi'))
                .catch(err => console.error('❌ Botda xato:', err));
        })
        .catch(err => console.error('❌ MongoDB Connection Error:', err))
});

app.get('/', (req, res) => {
    res.status(200).send('DZ Calculator Backend is Running...');
});