const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);
const ADMIN_ID = Number(process.env.ADMIN_ID);

// --- BU QATORLAR ALBATTA BO'LISHI KERAK ---
const adminState = {}; 
const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
// -----------------------------------------

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
        return ctx.reply('Foydalanuvchi Ismini Kiriting: ');
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

    // Admin Reply mantiqi
    if (userId === ADMIN_ID && ctx.message.reply_to_message) {
        const originalMsg = ctx.message.reply_to_message.text;
        const targetUserId = originalMsg.match(/ID: (\d+)/)?.[1];

        if (targetUserId) {
            await bot.telegram.sendMessage(targetUserId, `👨‍💻 Admin Xabari: ${text}`);
            return ctx.reply('Xabar Yuborildi ✅');
        }
    }

    const state = adminState[userId];

    if (userId === ADMIN_ID && state) {
        if (state.step === 'ASK_NAME') {
            adminState[userId].name = text;
            adminState[userId].step = 'ASK_DEVICES';
            return ctx.reply(`${text} Qurulmalar Limitini Kiriting: `);
        }

        if (state.step === 'ASK_DEVICES') {
            const devices = parseInt(text);
            if (isNaN(devices)) {
                return ctx.reply('Iltimos Faqat Raqam Kiriting!');
            }

            const name = adminState[userId].name;
            const waitingMsg = await ctx.reply(`⏳ Login Parol Olinmoqda...`);

            try {
                // BACKEND_URL endi aniq e'lon qilingan
                const response = await axios.post(`${BACKEND_URL}/api/admin/create-user`, {
                    name: name,
                    maxDevices: devices
                });

                const { loginToken, passwordToken } = response.data;

                if (waitingMsg) {
                    await bot.telegram.deleteMessage(ctx.chat.id, waitingMsg.message_id);
                }

                const resultText = `✅ *Foydalanuvchi Yaratildi\\!* \n\n` +
                                   `👤 *Isim:* ${name.replace(/-/g, '\\-')} \n` +
                                   `🔑 *Login:* \`${loginToken}\` \n` +
                                   `🔐 *Parol:* \`${passwordToken}\` \n` +
                                   `📱 *Limit:* ${devices} \n\n` +
                                   `_Nusxalash uchun ustiga bosing\\._`;

                await ctx.replyWithMarkdownV2(resultText);
                delete adminState[userId]; 
            } catch (error) {
                if (waitingMsg) {
                    await bot.telegram.deleteMessage(ctx.chat.id, waitingMsg.message_id);
                }
                ctx.reply(`❌ Xatolik yuz berdi: ` + error.message);
                delete adminState[userId];
            }
        }
    }
});

bot.launch().then(() => console.log('🤖 Bot Ishga Tushdi...'));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));