const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://twitter.com/search?q=abc%20cordoba%20portada&src=typed_query&f=live', { waitUntil: 'networkidle2' });
  await page.screenshot({path: 'example.png'});


  const results = await page.$$eval('a[href^="/abccordoba/"] img[src]', imgs => imgs.map(img => img.getAttribute('src')));
  console.log(results);

  browser.close();
})();