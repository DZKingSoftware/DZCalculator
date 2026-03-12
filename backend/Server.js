const express = require('express');
const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken')
const readline = require('readline');
const cors = require('cors');
const app = express();
require('dotenv').config();
const User = require('./moduls/Users');

app.use(express.json());
const PORT = process.env.PORT || 5000
const MONGO_URL = process.env.MONGO_URL;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(cors({
    origin: 'https://dz-calculator.netlify.app', // Faqat sizning frontendga ruxsat beradi
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true // Agar cookie yoki token ishlatilsa kerak bo'ladi
}));

mongoose.connect(MONGO_URL)
    .then(() => console.log('Mongo-DB Connected'))
    .catch((err) => console.log('MongoDB Error', err));

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
        res.status(201).json({ name, loginToken, passwordToken, maxDevices });
    } catch (error) {
        res.status(500).json({ message: 'Serverda Xatolik!', error: error.message });
    }
});

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
                return res.status(403).json({ message: `Limit To'lgan` })
            }
            user.usedDevices.push(deviceId);
            await user.save();
        };

        const token = jwt.sign(
            { userId: user._id, name: user.name },
            JWT_SECRET,
            { expiresIn: '30d' }
        )

        res.json({
            success: true,
            name: user.name,
            token: token
        });
    } catch (error) {
        res.status(500).json({ message: 'Xatolik Yuz Berdi!', error: error.message });
    };
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Terminaldan komanda kutish funksiyasi
const startCLI = () => {
    rl.question('\nBuyruq kiriting (create / exit): ', async (cmd) => {
        if (cmd === 'create') {
            rl.question('Ism: ', async (name) => {
                rl.question('Qurilma limiti: ', async (limit) => {
                    try {
                        const loginToken = crypto.randomBytes(4).toString('hex');
                        const passwordToken = crypto.randomBytes(4).toString('hex');

                        const newUser = new User({
                            name,
                            loginToken,
                            passwordToken,
                            maxDevices: Number(limit) || 1
                        });

                        await newUser.save();
                        console.log(`\n✅ Yaratildi! \nLogin: ${loginToken} \nParol: ${passwordToken}`);
                        startCLI(); // Qayta so'rash
                    } catch (err) {
                        console.log("Xato:", err.message);
                        startCLI();
                    }
                });
            });
        } else if (cmd === 'exit') {
            process.exit();
        } else {
            console.log("Noma'lum buyruq.");
            startCLI();
        }
    });
};

app.listen(PORT, () => {
    console.log(`Server Ishga Tushdi`)
    startCLI();
})