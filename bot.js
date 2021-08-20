const TeleBot = require('telebot');

const token = process.env.FEDETOKEN;
const bot = new TeleBot({
  token,
  usePlugins: ['regExpMessage', 'shortReply']
});

bot.on(['/start', '/hello'], (msg) => msg.reply.text('Welcome!'));

bot.on('/cover', (msg) => {
  const url = 'http://img.kiosko.net/2021/08/19/es/elpais.200.jpg';
  return msg.reply.photo(url);
});