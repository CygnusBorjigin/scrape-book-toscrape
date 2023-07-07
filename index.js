const pupetter = require('puppeteer');

const delay = (time) => {
    return new Promise(resolve => setTimeout(resolve, time));
}  

const getAllBooks = async ( page ) => {
    const allBooks = await page.evaluate(() => {
        let res = [];
        const allBooks = document.querySelectorAll('ol li');
        allBooks.forEach(book => {
            res.push(book.querySelector("img").getAttribute('src'))
        });
        return res;
    });
    return allBooks;
};

const getInfo = async ( page, allBooks ) => {
    var interval = 2000;
    allBooks.forEach(async (book, index) => {
        setTimeout(async () => {
            await page.click(`img[src="${book}"]`);
            await delay(1000);
            const bookInfo = await page.evaluate(() => {
                const title = document.querySelector('h1').innerText;
                const infoContent = document.querySelector("article.product_page")
                const firstDiv = infoContent.querySelector("div")
                const secondDivOfFirstDiv = firstDiv.querySelectorAll("div")[5]
                const headingInfo = secondDivOfFirstDiv.querySelectorAll("p")
                const price = headingInfo[0].innerText;
                const availability = headingInfo[1].innerText;

                const infoTable = infoContent.querySelector("table")
                const tableRows = infoTable.querySelectorAll("tr")
                const upc = tableRows[0].querySelector("td").innerText;
                const productType = tableRows[1].querySelector("td").innerText;
                const priceWithoutTax = tableRows[2].querySelector("td").innerText;
                const priceWithTax = tableRows[3].querySelector("td").innerText;
                const tax = tableRows[4].querySelector("td").innerText;
                const availabilityOfBooks = tableRows[5].querySelector("td").innerText;
                const numberOfReviews = tableRows[6].querySelector("td").innerText;

                return {title, price, availability, upc, productType, priceWithoutTax, priceWithTax, tax, availabilityOfBooks, numberOfReviews};
            });
            console.log(bookInfo);
            await page.goBack();
        }, index * interval)
    });
};

(async () => {
    const browser = await pupetter.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('https://books.toscrape.com');

    const allBooks = await getAllBooks(page);
    await getInfo(page, allBooks);
    
}
)();