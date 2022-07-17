import puppeteer from 'puppeteer';

import { load } from 'cheerio';

export class HobbyCenterKato {
    /**
     * @return {Promise<NewProduct[]>}
     */
    async get() {
        let url = '';
        const app = await puppeteer.launch({
            headless: true,
            args: [
                '--window-size=1280,720',
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-setuid-sandbox',
                '--no-first-run',
                '--no-sandbox',
                '--no-zygote',
                '--single-process',
                '--proxy-server=\'direct://\'',
                '--proxy-bypass-list=*',
            ],
        });
        const page = (await app.pages())[0];
        await page.setViewport({ width: 1280, height: 720 });
        await page.goto('https://www.hobbycenterkato.com/schedule', { waitUntil: ['load', 'networkidle2'] });
        await page.waitForSelector('iframe');
        for (let i = 0; i < 30; i++) {
            await new Promise(resolve => setTimeout(resolve), 1000);
            if (await page.$('iframe')) {
                const src = await page.evaluate(() => document.querySelector('iframe').getAttribute('src'));
                if (src) {
                    url = src;
                    break;
                }
            }
        }

        if (!url) {
            app.close();
            throw new Error('Failed to get url of new product list page');
        }

        await page.goto(url);
        await page.waitForSelector('table#theTable > thead > tr.footable-header');
        const tableHtml = await page.evaluate(() => document.querySelector('table#theTable').outerHTML);
        app.close();

        if (!tableHtml) {
            throw new Error('Failed to get table');
        }

        /** @type {NewProduct[]} */
        const result = [];
        let date = '';

        const $ = load(tableHtml);
        for (const tr of $('tbody > tr')) {
            const d = $('td:nth-child(6)', tr).text().trim();
            if (d !== '↓') {
                date = d;
            }
            const rawLabel = $('td:nth-child(2)', tr).text();
            result.push({
                id: $('td:nth-child(1)', tr).text(),
                name: $('td:nth-child(3)', tr).text(),
                date,
                maker: 'ホビーセンターカトー',
                price: +$('td:nth-child(4)', tr).text()?.replace(/予|￥|\\|¥|,/g, '').trim(),
                type: '',
                label: rawLabel.trim() === 'NNEW' ? 'NEW' : '',
                description: '',
            });
        }

        return result;
    }
}
