const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const ADMIN_ID = Number(process.env.ADMIN_ID);

const adminState = {}; 
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;

function parseTimeToMinutes(timeStr) {
    const parts = timeStr.split(':');
    if (parts.length === 2) {
        return (parseInt(parts[0]) * 60) + parseInt(parts[1]);
    }
    return parseInt(timeStr);
}

const mainMenu = Markup.keyboard([
    [`Login Parol Olish`, `Ilovaga O'tish`]
]).resize();

bot.start((ctx) => {
    ctx.reply(`Calculationga Xush Kelibsiz.`, mainMenu);
});

bot.hears('Login Parol Olish', async (ctx) => {
    const userId = ctx.from.id;
    if (userId === ADMIN_ID) {
        adminState[userId] = { step: 'ASK_NAME' };
        return ctx.reply('👤 Foydalanuvchi Ismini Kiriting: ');
    }

    await bot.telegram.sendMessage(ADMIN_ID, `Yangi So'rov!\n Kimdan: ${ctx.from.first_name}\n ID: ${ctx.from.id}\n Login va Parol Olmoqchi.`);
    ctx.reply(`So'rovingiz Muvofoqiyatli Yuborildi.`);
});

bot.hears(`Ilovaga O'tish`, (ctx) => {
    ctx.reply(`Ilovadan Foydalanish uchun quyidagi Havolaga O'ting: `,
        Markup.inlineKeyboard([
            [Markup.button.url('Ilovani Ochish', 'https://dz-calculator.netlify.app')]
        ])
    );
});

bot.on('text', async (ctx) => {
    const userId = ctx.from.id;
    const text = ctx.message.text;

    if (userId === ADMIN_ID && ctx.message.reply_to_message) {
        const originalMsg = ctx.message.reply_to_message.text;
        const targetUserId = originalMsg.match(/ID: (\d+)/)?.[1];
        if (targetUserId) {
            await bot.telegram.sendMessage(targetUserId, `🤖 So'rovingiz Bo'yicha: ${text}`);
            return ctx.reply('Xabar Yuborildi ✅');
        }
    }

    const state = adminState[userId];
    if (userId === ADMIN_ID && state) {
        
        if (state.step === 'ASK_NAME') {
            adminState[userId].name = text;
            adminState[userId].step = 'ASK_DEVICES';
            return ctx.reply(`📱 Qurulmalar Limitini Kiriting: `);
        }

        if (state.step === 'ASK_DEVICES') {
            const devices = parseInt(text);
            if (isNaN(devices)) return ctx.reply('Iltimos Faqat Raqam Kiriting!');
            
            adminState[userId].devices = devices;
            adminState[userId].step = 'ASK_DURATION';
            return ctx.reply(`⏳ Amal Qilish Vaqtini Kiriting:\n(Masalan: 1:15 yoki 45 daqiqa)`);
        }

        if (state.step === 'ASK_DURATION') {
            const duration = parseTimeToMinutes(text);
            if (isNaN(duration) || duration <= 0) {
                return ctx.reply('Iltimos vaqtni to\'g\'ri formatda kiriting! (Masalan: 1:30)');
            }

            const { name, devices } = adminState[userId];
            const waitingMsg = await ctx.reply(`⏳ ${name} uchun login parol yaratilmoqda...`);

            try {
                const response = await axios.post(`${BACKEND_URL}/api/admin/create-user`, {
                    name: name,
                    maxDevices: devices,
                    durationMinutes: duration
                });

                const { loginToken, passwordToken, expiresAt } = response.data;
                const durationText = `${duration} ${duration !== ':' ? 'daqiqa' : 'soat'}`;

                if (waitingMsg) {
                    try { await bot.telegram.deleteMessage(ctx.chat.id, waitingMsg.message_id); } catch (e) {}
                }

                const resultText = `✅ *Success User Created\\!* \n\n` +
                                   `👤 *User:* ${name.replace(/-/g, '\\-')} \n` +
                                   `🔑 *Login:* \`${loginToken}\` \n` +
                                   `🔐 *Password:* \`${passwordToken}\` \n` +
                                   `📱 *Devices:* ${devices} \n` +
                                   `⏳ *Expires:*  ${durationText}\n` +
                                   `⚠️ _Vaqt tugagach, login avtomatik o'chadi\\._`;

                await ctx.replyWithMarkdownV2(resultText);
                delete adminState[userId]; 

            } catch (error) {
                if (waitingMsg) {
                    try { await bot.telegram.deleteMessage(ctx.chat.id, waitingMsg.message_id); } catch (e) {}
                }
                ctx.reply(`❌ Xatolik: ` + error.message);
                delete adminState[userId];
            }
        }
    }
});

module.exports = { bot };