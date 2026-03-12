const mongoose = require('mongoose');
const crypto = require('crypto');
const inquirer = require('inquirer');
const User = require('./Users');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URL)
    .then(async () => {
        console.log('Bazaga Ulanildi')

        const aswars = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Foydalanuvchi Ismi',
                validate: input => input ? true : `Ism Bo'sh Bo'lmasligi kerak`
            },
            {
                type: 'number',
                name: 'maxDevices',
                message: 'Nechta Qurulma ulana oladi?',
                default: 1
            }
        ]);

        const loginToken = crypto.randomBytes(4).toString('hex');
        const passwordToken = crypto.randomBytes(4).toString('hex');

        const newUser = new User({
            name: answers.name,
            loginToken,
            passwordToken,
            maxDevices: answers.maxDevices,
            usedDevices: []
        });

        await newUser.save();

        console.log(`Mufovaqiyatli Yaraildi`);
        console.table({
            "Ism": answers.name,
            "Login Token": loginToken,
            "Parol Token": passwordToken,
            "Limit": answers.maxDevices
        });

        mongoose.connection.close();
    })
    .catch(err => console.error(`Xatolik Yuzberdi: `, err))