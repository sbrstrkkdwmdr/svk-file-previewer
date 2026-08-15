import type { file, pathableItem, pathableItemFolder } from "$lib/data/files";
import { downloadGet } from "$lib/server/database";
import { createHash } from "$lib/server/tool";
import { getFiles } from "$lib/server/files/updater";
import * as fs from "fs";

export function getFile(dir: string, fileName: string) {
    const files = getFiles();
    const searchFiles = files?.slice() ?? [];
    const temp = searchFiles.filter(
        (x) =>
            x.path.endsWith(dir + "/" + fileName) ||
            (x.directory == dir && x.name == fileName),
    );
    return temp;
}

/**
 * convert files into pathableItem type for readability
 */
export async function toPathableItem(
    root = "/",
): Promise<pathableItem<"folder">> {
    const files = getFiles();
    const rootparts = stripFolder(root);
    root = rootparts.join("/");
    const rootname = rootparts?.pop() ?? "";
    const rootlocation = rootparts.join("/") ?? "";
    const data: pathableItem<"folder"> = {
        type: "folder",
        name: rootname,
        directory: rootlocation,
        children: [],
        size: 0,
        hash: "",
    };
    if (!files) return data;
    for (const file of files) {
        const parents = stripFolder(file.directory);

        if (!parents.join("/").startsWith(root)) {
            continue;
        }
        const newFile: pathableItem<"file"> = {
            type: "file",
            name: file.name,
            directory: file.directory,
            size: file.size,
            hash: file.hash,
            downloadCount: 0,
        };

        if (parents.length == 0) {
            data.children.push(newFile);
        } else {
            formatFileSubfolder(data, parents, newFile);
        }
    }

    const sizefix = fixFolderSizes(data);
    const dlfix = await fixFileDownloads(sizefix);
    // return current folder instead of topmost parent
    const locationFix = fixRootLocation(dlfix);
    const pathfix = fixPaths(
        locationFix,
        (rootlocation.endsWith("/") ? rootlocation : rootlocation + "/") +
            rootname,
    );
    const sorted = sortPathable(pathfix as pathableItem<"folder">);
    // printChildren(sorted);
    return sorted;
}
function printChildren(item: pathableItem<"folder">) {
    for (const file of item.children) {
        console.log(
            file.directory.endsWith("/")
                ? file.directory
                : file.directory + "/",
            ":",
            file.name,
        );
        if (file.type == "folder") {
            printChildren(file as pathableItem<"folder">);
        }
    }
}

function formatFileSubfolder(
    data: pathableItem<"folder">,
    parents: string[],
    newFile: pathableItem<"file">,
) {
    let curparent: pathableItem<"folder"> = data;
    const found: string[] = [];
    for (const str of parents) {
        for (const child of curparent.children) {
            if (child.name == str && child.type == "folder") {
                curparent = child as pathableItem<"folder">;
                found.push(str);
                break;
            }
        }
        if (!found.includes(str)) {
            // found.push(str);
            const newchild: pathableItem<"folder"> = {
                type: "folder",
                hash: createHash("/" + found.join("/") + "/" + str),
                name: str,
                directory: "/" + found.join("/") + "/",
                size: 0,
                children: [],
            };
            curparent.children.push(newchild);
            curparent = newchild;
        }
    }
    curparent.children.push(newFile);
}

function stripFolder(path: string) {
    const arr = path.split("/");
    if (path.startsWith("/")) arr.shift();
    if (path.endsWith("/")) arr.pop();
    return arr;
}

function fixPaths(
    data: pathableItemFolder,
    root = (data.directory.endsWith("/")
        ? data.directory
        : data.directory + "/") + data.name,
) {
    for (let child of data.children) {
        child.directory = root;
        if (child.type == "folder") {
            child = fixPaths(child);
        }
    }
    return data;
}

function fixFolderSizes(data: pathableItemFolder) {
    let n = 0;
    for (let child of data.children) {
        if (child.type == "folder") {
            child = fixFolderSizes(child);
        }
        n += child.size;
    }
    data.size = n;
    return data;
}

async function fixFileDownloads(data: pathableItemFolder) {
    for (let child of data.children) {
        if (child.type == "folder") {
            child = await fixFileDownloads(child);
        } else {
            child.downloadCount = await downloadGet(
                child.hash,
                // child.directory,
                // child.name,
            );
        }
    }
    return data;
}

function fixRootLocation(data: pathableItemFolder) {
    const name = data.name;
    while (data.children.length == 1 && data.children[0].type == "folder") {
        data = data.children[0];
    }
    data.name = name;
    data.directory = name;
    return data;
}

function sortPathable(data: pathableItemFolder) {
    data.children.sort(sortPathableDirect);
    for (const child of data.children) {
        if (child.type == "folder") {
            sortPathable(child);
        }
    }
    return data;
}

function sortPathableDirect(a: pathableItem, b: pathableItem) {
    if (a.type == b.type) return a.name.localeCompare(b.name);
    if (a.type == "folder") return 1;
    return -1;
}

export function getFileContent(file: file) {
    let content: NonSharedBuffer | null = null;
    if (fs.existsSync("./files/" + file.path)) {
        content = fs.readFileSync("./files/" + file.path);
    }
    return content;
}
