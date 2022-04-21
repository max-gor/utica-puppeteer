// import puppeteer library
const puppeteer = require('puppeteer');

(async () => {
    // create browser instance and launch it
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ['--start-fullscreen'],
    });

    // open up new page
    const page = await browser.newPage();

    // go to google and wait
    // argument considers navigation successful when page has no more then 2 network requests for half a second
    await page.goto('https://google.com', {
        waitUntil: 'networkidle2',
    });

    // input with name "q"
    await page.waitForSelector('input[name=q]');

    // type the phrase
    const phrase = 'Utica University';
    await page.type('input[name=q]', phrase);

    //
    await page.keyboard.press('Enter');

    // wait for results
    await page.waitForSelector('#result-stats');

    // take the screenshot
    await page.screenshot({ path: './screenshots/page.png' });

    // map through all anchors "a's" and return "href" and link text
    const links = await page.evaluate(() =>
        Array.from(document.querySelectorAll('a')).map((anchor) => [anchor.href, anchor.textContent])
    );

    // keep the page up for 3 seconds
    await page.waitForTimeout(3000).then(() => {
        console.log(links);
    });

    // close the tab
    await page.close();

    // close the browser
    await browser.close();
})();
