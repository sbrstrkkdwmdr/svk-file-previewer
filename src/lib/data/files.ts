export type file = {
    fName: string, // file name
    aUrl: string, // base url
    rel: string,
    size: number,
};

export interface pathableItem<T = 'folder' | 'file'> {
    type: T,
    name: string, //fName
    path: string, // path 
    children: pathableItem[],
    size: number, // bytes
    downloadCount?: number;
    forceInitialOpen?: boolean;
}