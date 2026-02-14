// for example file "C:/repo/files/subfolder/main.txt"
export type file = {
    directory: string; // "/subfolder/"
    name: string; // "main.txt"
    extension: string; // "txt"
    path: string; // "/subfolder/main.txt"
    size: number; // 353
    hash: string; // 
};

export interface pathableItem<T = "folder" | "file"> {
    type: T;
    hash: string;
    name: string; // fName
    directory: string; // path
    children: pathableItem[];
    size: number; // bytes
    downloadCount?: number;
    forceInitialOpen?: boolean;
}
