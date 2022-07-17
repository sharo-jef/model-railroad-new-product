interface NewProduct {
    id: string;
    name: string;
    date: string;
    maker: string;
    price: number?;
    /** 完成品, 車両キット, パーツ, etc. */
    type: string?;
    /** 新製品, 再生産品, etc. */
    label: string?;
    /** 説明文など */
    description: string;
}

interface Repository {
    get(): Promise<NewProduct>;
}

interface HobbyCenterKato extends Repository {
}

interface Kato extends Repository {
}

interface GreenMax extends Repository {
}
