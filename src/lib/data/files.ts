// for example file "C:/repo/files/subfolder/main.txt"
export type file = {
    directory: string; // "/subfolder/"
    name: string; // "main.txt"
    extension: string; // "txt"
    path: string; // "/subfolder/main.txt"
    size: number; // 353
    hash: string; //
};

type item = "file" | "folder" | "unknown";

export type pathableItem<T extends item = "unknown"> = T extends "file"
    ? pathableItemFile
    : T extends "folder"
      ? pathableItemFolder
      : pathableItemFile | pathableItemFolder;

export type pathableItemGeneric = {
    hash: string;
    name: string; // fName
    directory: string; // path
    size: number;
};

export type pathableItemFile = pathableItemGeneric & {
    type: "file";
    downloadCount: number;
};

export type pathableItemFolder = pathableItemGeneric & {
    type: "folder";
    children: pathableItem[];
};
