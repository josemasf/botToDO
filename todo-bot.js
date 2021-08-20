const TelegramBot = require('node-telegram-bot-api');
const Nodemailer = require('nodemailer');

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.FEDETOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

const transporter = Nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAILUSER || 'tucorreo@gmail.com',
    pass: process.env.MAILPASS || 'tucontraseña'
  }
});

let mensaje = "";

let mailOptions = {
  from: process.env.MAILUSER ||'tucorreo@gmail.com',
  to: process.env.MAILTODO ||'mi-amigo@yahoo.com',
  subject: 'Hola',//msg.text.toString(),
  text: mensaje
};


// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for any kind of message. There are different kinds of
// messages.
/*bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // send a message to the chat acknowledging receipt of their message
  console.log(msg);
});*/

bot.onText(/\/test/, (msg, match) => {
    // 'msg' is the received Message from Telegram
    // 'match' is the result of executing the regexp above on the text content
    // of the message
  
    const chatId = msg.chat.id;
    const resp = match[1]; // the captured "whatever"
  
    bot.sendMessage(chatId, "Hola " + msg.from.username);
  });


bot.onText(/\/todo (.+)/, (msg, match) =>{  
  const newItemTODO = match[1];
  mailOptions.subject = newItemTODO;

  if(isUserAtorizated(msg.from.username)){
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email enviado: ' + info.response);
        bot.sendMessage(chatId, 'Tarea '+ newItemTODO +' registrada');
      }
    });
  }
});

function isUserAtorizated(username){
  switch(username){
    case 'josemasf':
    case 'pablo_sf':
        return true;
    default:
      return false;
  }
}

bot.onText(/\/covers/, (msg, match) =>{  

  //bot.sendMessage(chatId, "Las portadas del dia de hoy son:");

  let url = 'https://telegram.org/img/t_logo.png';
  bot.sendPhoto(chatId, url);
  
  //url = 'http://img.kiosko.net/2021/08/19/es/elpais.200.jpg';
  //bot.sendPhoto(chatId, url);
  
});