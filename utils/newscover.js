
const cheerio = require('cheerio');
const request =  require('request');
const getDateTime = require('./common.js').utils;

const url = {
    odb: 'https://es.kiosko.net/es/geo/Cordoba.html',
    general: 'https://es.kiosko.net/es/general.html',
    sport: 'https://es.kiosko.net/es/sport.html',
};

const newpapper ={
    general: ['El País', 'El Mundo', 'La Razón'],
    sport: ['Marca', 'As', 'Sport', 'El Mundo Deportivo']
}

function parseCover(src){
    //img.kiosko.net/2021/08/19/es/elpais.200.jpg

    const data = src.replace('//img.kiosko.net/', '').replace('.200.jpg', '');
    const coverParsed = data.split('/')

    return {
        year: coverParsed[0],
        month: coverParsed[1],
        day: coverParsed[2],
        name:  coverParsed[4]        
    }

}

module.exports.getCovers = async function(){
    const newsPaperCover = [];

    console.log('Task NewsCover inicio: ' + getDateTime());
    
    request({
        method: 'GET',
        url: url.odb
    }, async (err, res, body) => {
        const $ = cheerio.load(body)
        await $('.noline.wadv ul img', body).each((item) => {
            console.log(parseCover(item.attribs.src).name)
            newsPaperCover.push(item.attribs.src)
        })

        console.log('Fin de NewsODB: ' + getDateTime());
    });



    request({
        method: 'GET',
        url: url.general
    }, async (err, res, body) => {
        const $ = cheerio.load(body)
        await $('.line ul img', body).each((index, item) => {
            const name = item.attribs.alt.toString()
            if (newpapper.general.includes(name)){
                console.log(item.attribs.src)
                newsPaperCover.push(item.attribs.src)
            }
        })
        console.log('Fin de NewsGeneral: ' + getDateTime());
    });

    request({
        method: 'GET',
        url: url.sport
    }, async (err, res, body) => {
        const $ = cheerio.load(body)
        await $('.line ul img', body).each((index, item) => {
            const name = item.attribs.alt.toString()
            if (newpapper.sport.includes(name)){            
                console.log(item.attribs.src)
                newsPaperCover.push(item.attribs.src)
            }
        })
        console.log('Fin de NewsSport: ' + getDateTime());
    });

    return newsPaperCover
}