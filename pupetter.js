console.log(msg, 'cover');
const date = new Date();  
const puppeteer = require('puppeteer');

const chromeOptions = {
  headless: true,
  defaultViewport: null,
  args: [
      "--incognito",
      "--no-sandbox",
      "--single-process",
      "--no-zygote"
  ],
};

(async () => {
  const browser = await puppeteer.launch(chromeOptions);
  const page = await browser.newPage();

  await page.goto('https://twitter.com/search?q=abc%20cordoba%20portada&src=typed_query&f=live', {
    waitUntil: 'networkidle2'
  });

  const results = await page.$$eval('a[href^="/abccordoba/"] img[src]', imgs => imgs.map(img => img.getAttribute('src')));

  for(let i = 0; i< 2; i++){
    const abcCover = results[i]
    msg.reply.photo(abcCover)
  }   

  browser.close();
})();