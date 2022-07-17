import axios from 'axios';
import { load } from 'cheerio';

/**
 * @param {string} url
 * @param {import('axios').AxiosRequestConfig} config
 * @returns {Promise<import('cheerio').CheerioAPI>}
 */
export async function fetch(url = '', config = {}) {
    const response = await axios.get(url, config);
    if (!response.data) {
        throw new Error(`Failed to fetch: ${url}`);
    }
    return load(response.data);
}
