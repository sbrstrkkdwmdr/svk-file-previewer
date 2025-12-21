export type file = {
    fName: string, // file name
    aUrl: string, // base url
    rel: string,
    size: number,
    hash: string,
};

export interface pathableItem<T = 'folder' | 'file'> {
    type: T,
    hash: string,
    name: string, // fName
    path: string, // path 
    children: pathableItem[],
    size: number, // bytes
    downloadCount?: number;
    forceInitialOpen?: boolean;
}