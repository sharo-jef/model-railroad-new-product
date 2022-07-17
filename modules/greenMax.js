import { fetch } from '../utils/fetch.js';

export class GreenMax {
    /**
     * @returns {Promise<NewProduct[]>}
     */
    async get() {
        const $ = await fetch('http://www.greenmax.co.jp/schedule/');
        /** @type {NewProduct[]} */
        const result = [];
        let title = '';
        for (const el of $('.schedule_dt,.schedule_dd')) {
            if (/schedule_dt/.test($(el).attr('class'))) {
                title = $(el).text();
                continue;
            }
            for (const section of $('.schedule_item', el)) {
                const url = $('a', section).attr('href');
                let description = '';
                if (url) {
                    const $ = await fetch(url);
                    $('dl').each((_, dl) => {
                        if ($('dt > div', dl).text() === '商品の特徴') {
                            $('dd > p', dl).each((_, p) => description += `${$(p).html().replace(/<br[ ]*\/?>/g, '\n')}\n`);
                        }
                    });
                }
                result.push({
                    id: $('.schedule_num', section).text().replace(/<|＜|＞|>/g, ''),
                    name: $('.schedule_name_ta', section).text(),
                    date: title,
                    price: +$('.schedule_price', section).text().replace(/\\|￥|,|\.|-/g, ''),
                    type: $('.schedule_type', section).text(),
                    label: $('a > div:nth-child(1)', section).text(),
                    description,
                });
            }
        }
        return result;
    }
}
