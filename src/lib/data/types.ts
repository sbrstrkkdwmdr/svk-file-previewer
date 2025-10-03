export type Dict<T = any> = { [key: string]: T; };

export type usedItem = {
    name: string;
    src: string;
    id: string;
    site: string;
};
export type portfolioItem = {
    name: string;
    used: usedItem[];
    status: string;
    description: string;
    links: {
        name: string;
        url: string;
        icon: string;
    }[];
    pixelArt: boolean;
};