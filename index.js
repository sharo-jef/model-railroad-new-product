// https://rail-moka.com/?mode=f11

import { HobbyCenterKato } from './modules/hobbyCenterKato.js';
import { Kato } from './modules/kato.js';
import { GreenMax } from './modules/greenMax.js';

class NewProductRepository {
    /**
     * @returns {Promise<NewProduct>}
     */
    async get() {
        const repos = [
            new HobbyCenterKato(),
            new Kato(),
            new GreenMax(),
        ];
        const result = (await Promise.all(repos.map(repo => repo.get()))).flat();
        return result;
    }
}

export {
    HobbyCenterKato,
    Kato,
    GreenMax,
    NewProductRepository,
};
