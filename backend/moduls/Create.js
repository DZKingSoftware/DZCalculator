const mongoose = require('mongoose');
const crypto = require('crypto');
const inquirer = require('inquirer');
const User = require('./moduls/Users'); // Yo'lni tekshiring!
require('dotenv').config();

mongoose.connect(process.env.MONGO_URL)
    .then(async () => {
        console.log('✅ Bazaga ulanildi');

        // O'zgaruvchi nomini to'g'riladik: answers
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Foydalanuvchi ismi:',
                validate: input => input ? true : `Ism bo'sh bo'lmasligi kerak`
            },
            {
                type: 'number',
                name: 'maxDevices',
                message: 'Nechta qurulma ulana oladi?',
                default: 1
            },
            {
                type: 'number',
                name: 'durationMinutes',
                message: 'Amal qilish muddati (daqiqa):',
                default: 60
            }
        ]);

        const loginToken = crypto.randomBytes(4).toString('hex');
        const passwordToken = crypto.randomBytes(4).toString('hex');

        // Vaqtni hisoblash (Login ishlashi uchun expiresAt kerak!)
        const expirationDate = new Date();
        expirationDate.setMinutes(expirationDate.getMinutes() + Number(answers.durationMinutes));

        const newUser = new User({
            name: answers.name,
            loginToken,
            passwordToken,
            maxDevices: answers.maxDevices,
            usedDevices: [],
            expiresAt: expirationDate // Buni qo'shishni unutmang!
        });

        await newUser.save();

        console.log(`\n✅ Muvaffaqiyatli yaratildi!`);
        console.table({
            "Ism": answers.name,
            "Login Token": loginToken,
            "Parol Token": passwordToken,
            "Limit": answers.maxDevices,
            "Tugash vaqti": expirationDate.toLocaleString()
        });

        mongoose.connection.close();
    })
    .catch(err => {
        console.error(`❌ Xatolik yuz berdi: `, err);
        process.exit(1);
    });