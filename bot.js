require('dotenv').config();
const TeleBot = require('telebot');

const cheerio = require('cheerio');
const request = require('request');

const token = process.env.FEFESTOKEN;
const bot = new TeleBot(token);

const url = {
  odb: 'https://es.kiosko.net/es/geo/Cordoba.html',
  general: 'https://es.kiosko.net/es/general.html',
  sport: 'https://es.kiosko.net/es/sport.html',
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
  const date = new Date();

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
  console.log(msg, 'cover');
  const date = new Date();  
  const puppeteer = require('puppeteer');

  (async () => {
    const browser = await puppeteer.launch({
      headless: true
    });
    const page = await browser.newPage();

    await page.goto('https://twitter.com/search?q=abc%20cordoba%20portada&src=typed_query&f=live', {
      waitUntil: 'networkidle2'
    });

    const results = await page.$$eval('a[href^="/abccordoba/"] img[src]', imgs => imgs.map(img => img.getAttribute('src')));

    for(let i = 0; i< 2; i++){
      const abcCover = results[i].replace('&name=360x360', '')
      msg.reply.photo(abcCover)
    }   

    browser.close();
  })();

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