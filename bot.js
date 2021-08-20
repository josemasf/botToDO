const TeleBot = require('telebot');

const token = process.env.FEDETOKEN;
const bot = new TeleBot(token);

bot.on(['/start', '/hello'], (msg) =>{
  console.log(msg,'holaaaaa');
  msg.reply.text('Welcome!')});

bot.on('/cover', (msg) => {
  console.log(msg, 'cover');
  const url = 'http://img.kiosko.net/2021/08/19/es/elpais.200.jpg';
  return msg.reply.photo(url);
});