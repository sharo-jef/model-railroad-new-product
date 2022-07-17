import { fetch } from '../utils/fetch.js';

export class Kato {
    /**
     * @return {Promise<NewProduct[]>}
     */
    async get() {
        const $ = await fetch('https://www.katomodels.com/schedule');
        /** @type {NewProduct[]} */
        const result = [];
        for (const el of $('table > tbody > tr')) {
            if ($('td', el).length > 0) {
                result.push({
                    id: $('td:nth-child(1) > .number_pc', el)?.text(),
                    name: $('td.name > a', el)?.text(),
                    date: $('td.date', el)?.text(),
                    maker: 'カトー',
                    price: +$('td.price', el)?.text()?.replace(/予|￥|,/g, ''),
                    type: '',
                    label: $('td.name > span.special', el)?.text() || $('td.name > span.new', el)?.text() || '',
                    description: '',
                });
            }
        }

        return result;
    }
}
