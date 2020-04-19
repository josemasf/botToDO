const TelegramBot = require('node-telegram-bot-api');

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.FEDETOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

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
  
    bot.sendMessage(chatId, "Welcome");
  });


bot.onText(/\/TODO/, (msg, match=>{
  //Creamos el objeto de transporte
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAILUSER || 'tucorreo@gmail.com',
      pass: process.env.MAILPASS || 'tucontraseña'
    }
  });

  var mensaje = "Hola desde nodejs...";

  var mailOptions = {
    from: process.env.MAILUSER ||'tucorreo@gmail.com',
    to: process.env.MAILTODO ||'mi-amigo@yahoo.com',
    subject: 'Hola',//msg.text.toString(),
    text: mensaje
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email enviado: ' + info.response);
    }
  });
}))