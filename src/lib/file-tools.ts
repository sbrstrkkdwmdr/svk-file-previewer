import type { pathableItem } from "./data/files";
import type { Dict } from "./data/types";
import { getMime } from "$lib/data/filetypes";
import { stringMatches } from "./tools";

export function fileSearch(parent: pathableItem<"folder">, match: string) {
    const temp: pathableItem<"folder"> = { ...parent };
    temp.children = [];
    for (const file of parent.children) {
        if (
            stringMatches(file.name, match) ||
            (stringMatches(file.directory, match) && file.directory != "")
        ) {
            temp.children.push(file);
        } else if (file.type == "folder") {
            const nf = fileSearch(file as pathableItem<"folder">, match);
            if (nf.children.length > 0) {
                temp.children.push(nf);
            }
        }
    }
    return temp;
}

export function fileNameParts(str: string) {
    let name = str;
    let ext = "";
    if (str.includes(".")) {
        const temp = str.split(".");
        ext = temp.pop()!;
        name = temp.join(".");
    }
    let fullString = [name];
    if (ext.length > 0) fullString.push("." + ext);
    return fullString;
}

export type sortmodes = "name" | "mime" | "size" | "ext";

type comparefn = (
    a: pathableItem<"folder" | "file">,
    b: pathableItem<"folder" | "file">,
) => number;

const compares: Dict<comparefn, sortmodes> = {
    name: (foo, bar) => foo.name.localeCompare(bar.name),
    mime: (foo, bar) => {
        const gt = (tmp: pathableItem) =>
            tmp.type == "folder" ? "" : getMime(tmp.name);
        const a = gt(foo);
        const b = gt(bar);
        const p1 = a.localeCompare(b);
        if (p1 == 0) return compares.name(foo, bar);
        return p1;
    },
    size: (foo, bar) => {
        const p1 = bar.size - foo.size;
        if (p1 == 0) return compares.name(foo, bar);
        return p1;
    },
    ext: (foo, bar) => {
        const a = fileNameParts(foo.name);
        const b = fileNameParts(bar.name);
        if (!a[1] && !b[1]) return 0;
        if (!a[1]) return 1;
        if (!b[1]) return -1;
        const p1 = a[1].localeCompare(b[1]);
        if (p1 == 0) return compares.name(foo, bar);
        return p1;
    },
};

export function sort(
    collection: pathableItem[],
    sort: sortmodes,
    direction: "up" | "down",
    folderhandling: "mixed" | "top" | "bottom",
) {
    collection.sort(compares[sort]);
    if (direction == "up") collection.reverse();
    handleFolders(collection, folderhandling);
}
function handleFolders(
    collection: pathableItem[],
    type: "mixed" | "top" | "bottom",
) {
    if (type == "mixed") return;
    const folders: pathableItem[] = [];
    const files: pathableItem[] = [];
    let len = collection.length;
    for (let i = 0; i < len; i++) {
        const file = collection.shift()!;
        if (file.type == "file") files.push(file);
        if (file.type == "folder") folders.push(file);
    }
    if (type == "top") {
        pushall(collection, folders);
        pushall(collection, files);
    } else {
        pushall(collection, files);
        pushall(collection, folders);
    }
}
function pushall<T extends any>(main: T[], sub: T[]) {
    for (const item of sub) {
        main.push(item);
    }
}
