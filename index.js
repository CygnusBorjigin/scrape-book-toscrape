const pupetter = require('puppeteer');

const delay = (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
}  

(async () => {
    const browser = await pupetter.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('https://books.toscrape.com');

    const allBooks = await page.evaluate(() => {
        let res = [];
        const allBooks = document.querySelectorAll('ol li');
        allBooks.forEach(book => {
            res.push(book.querySelector("img").getAttribute('src'))
        });
        return res;
    });

    var interval = 2000;

    allBooks.forEach(async (book, index) => {
        setTimeout(async () => {
            await page.click(`img[src="${book}"]`);
            await delay(1000);
            await page.goBack();
        }, index * interval)
    });
}
)();