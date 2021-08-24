require('dotenv').config();
const TeleBot = require('telebot');

const cheerio = require('cheerio');
const request = require('request');

const token = process.env.FEFESTOKEN;
const bot = new TeleBot(token);

const date = new Date();

const url = {
  odb: 'https://es.kiosko.net/es/geo/Cordoba.html',
  general: 'https://es.kiosko.net/es/general.html',
  sport: 'https://es.kiosko.net/es/sport.html',
  abc: 'https://www.kioskoymas.com/publicacion/portada/abc/2019/20191109',
};

const newpapper = {
  general: ['El País', 'El Mundo', 'La Razón'],
  sport: ['Marca', 'As', 'El Mundo Deportivo']
}

bot.start();

bot.on(['/start', '/hello'], (msg) => {
  console.log(msg, 'holaaaaa');
  msg.reply.text('Welcome!')
});

bot.on('/cover', async (msg) => {
  console.log(msg, 'cover');


  const newsPaperCover = [];

  console.log('Task NewsCover inicio: ' + date.toISOString());

  request({
    method: 'GET',
    url: url.odb
  }, async (err, res, body) => {
    const $ = cheerio.load(body)
    await $('.thcover img', body).each((index, item) => {
      const cover = parseCover(item.attribs.src)
      console.log(cover.name)
      msg.reply.photo(cover.src)

    })

    console.log('Fin de NewsODB: ' + date.toISOString());
  });

  request({
    method: 'GET',
    url: url.abc
  }, async (err, res, body) => {
    const $ = cheerio.load(body)
    await $('#main-image', body).each((index, item) => {

      console.log(item.attribs.src)
      const cover = item.attribs.src.replace('/2019/', '/2192/')
      console.log(`https://www.kioskoymas.com/img/resized/${cover}`)

      msg.reply.photo(`https://www.kioskoymas.com${cover}`)

    })
    console.log('Fin de NewsABC: ' + date.toISOString());
  });



  request({
    method: 'GET',
    url: url.general
  }, async (err, res, body) => {
    const $ = cheerio.load(body)
    await $('.line ul img', body).each((index, item) => {
      const name = item.attribs.alt.toString()
      if (newpapper.general.includes(name)) {
        const cover = parseCover(item.attribs.src)
        console.log(cover.name)
        msg.reply.photo(cover.src)
      }
    })
    console.log('Fin de NewsGeneral: ' + date.toISOString());
  });

  request({
    method: 'GET',
    url: url.sport
  }, async (err, res, body) => {
    const $ = cheerio.load(body)
    await $('.line ul img', body).each((index, item) => {
      const name = item.attribs.alt.toString()
      if (newpapper.sport.includes(name)) {
        const cover = parseCover(item.attribs.src)
        console.log(cover.name)
        msg.reply.photo(cover.src)
      }
    })
    console.log('Fin de NewsSport: ' + date.toISOString());
  });
});

bot.on('/abc', async (msg) => {

  request({
    method: 'GET',
    url: url.abc
  }, async (err, res, body) => {
    const $ = cheerio.load(body)
    await $('#main-image', body).each((index, item) => {
      const name = 'ABC Códoba'

      console.log(item.attribs.src)
      const cover = item.attribs.src.replace('/2019/', '/2192/')
      console.log(`https://www.kioskoymas.com/img/resized/${cover}`)

      msg.reply.photo(`https://www.kioskoymas.com${cover}`)

    })
    console.log('Fin de NewsABC: ' + date.toISOString());
  });
});


function parseCover(src) {
  //img.kiosko.net/2021/08/19/es/elpais.200.jpg

  const data = src.replace('//img.kiosko.net/', '').replace('.200.jpg', '');
  const coverParsed = data.split('/')

  return {
    year: coverParsed[0],
    month: coverParsed[1],
    day: coverParsed[2],
    name: coverParsed[4],
    src: `http:${src.replace('.200', '')}`
  }

}