//Once the site analytics is loaded ...
const puppeteer = require('puppeteer');
var clc = require("cli-color");
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function init() {
rl.question('Please Enter the website (It is the url after your put in the dupixent site)',scrape);
}

init();

//scrape away!
async function scrape(website) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        //go to url
        await page.goto(website, {waitUntil: 'networkidle0'})
        const data = await page.evaluate(() => {

            const returnObj = {};
            const defer = '#offscreen-images';
            const nextGen = '#modern-image-formats';
            const explicit = '#unsized-images table tbody';
            const encode = "#uses-optimized-images";
            const optArray = [defer,nextGen,explicit,encode];

            optArray.map(id => {
                let element = document.querySelector(id)
                let elements = element.querySelectorAll('tr td.lh-table-column--url a')
                let links = Array.from(elements).map(el => el.getAttribute('href'))
                returnObj[id] = links;

            })
            return returnObj
        })
        console.log(clc.magentaBright('--------------------'));
        console.log(`${clc.bgMagentaBright.black(website)}`)
        for (const property in data) {
            console.log( `${clc.green(property)} === ${data[property]}`)
        }
        console.log(clc.magentaBright('--------------------'));

        await browser.close()
        rl.question('Would you search another site (y or n)', (input) => {
            input === 'y' ? scrape() : rl.close();
        })
    } catch (err) {
        console.log(err);
    }
}






        
