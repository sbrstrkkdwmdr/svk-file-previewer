import type { file, pathableItem } from "$lib/data/files";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { downloadGet } from "./database";
import { fileNameSeparate, fixWindowsPath, relativePath } from "./tool";
type result = { file: string; size: number };

export let files: file[] | null = null;

let fLastUpdate = new Date().getTime();
const rootFolder = "files";
let currentlyUpdating = false;
const fileSyncTimer = 1000 * 60 * 60;

export async function updateFiles() {
    if (currentlyUpdating) return;
    if (
        !Boolean(files) ||
        Math.abs(fLastUpdate - new Date().getTime()) > fileSyncTimer
    ) {
        currentlyUpdating = true;
        files = null;
        console.log("Updating file explorer...");
        fLastUpdate = new Date().getTime();
        await new Promise((resolve, reject) => {
            walk(`./${rootFolder}`, (err, res) => {
                walkCallback(err!, res!, resolve, reject, [
                    /* add more folder paths if necessary */
                ]);
            });
        });
        currentlyUpdating = false;
    }
    return files;
}

// convert all files to somewhat readable format
export function editFiles(results: result[]): file[] {
    const data = results
        .map((x) => {
            let p = fixWindowsPath(x.file);
            let rel = relativePath(p);
            const pathspecific = fileNameSeparate(rel);
            return {
                directory: pathspecific.path,
                name: pathspecific.filename,
                extension: pathspecific.extension,
                path: rel,
                size: x.size,
                hash: createHash(rel),
            } as file;
        })
        .sort(sortFiles);
    for (const item of data) {
        if (!item.path.startsWith("/")) item.path = "/" + item.path;
        if (!item.directory.startsWith("/"))
            item.directory = "/" + item.directory;
    }
    return data;
}

function sortFiles(a: file, b: file) {
    if (a.path != b.path) return a.path.localeCompare(b.path);
    return a.name.localeCompare(b.name);
}

// modified from stackoverflow
export function walk(
    dir: string,
    done: (err?: Error | null, results?: result[]) => void,
) {
    var results: result[] = [];
    fs.readdir(dir, function (err, list) {
        // if error on read
        if (err) return done(err);
        // if no files found
        let pending = list.length;
        if (!pending) return done(null, results);

        list.forEach(function (file) {
            // idk what this does. check if file valid??
            file = path.resolve(dir, file);

            // get file stats
            fs.stat(file, function (err, stat) {
                if (stat && stat.isDirectory()) {
                    // if "file" is actually a folder, then recursively call this function on its children
                    walk(file, function (err?: Error | null, res?: result[]) {
                        // append results to output
                        if (res) results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    // append results to output
                    results.push({ file: file, size: stat?.size ?? 0 });
                    if (!--pending) done(null, results);
                }
            });
        });
    });
}

const walkCallback = (
    err: Error,
    results: result[],
    resolve: (value?: unknown) => void,
    reject: (reason?: any) => void,
    nextDirs: string[],
) => {
    if (err) {
        console.log(err);
        files = [
            {
                directory: "error",
                name: "error",
                extension: "error",
                path: "error",
                size: 0,
                hash: "error",
            },
        ];
        resolve(false);
        files = null;
    } else {
        // if no more directories to parse through, end function
        if (nextDirs.length == 0) {
            walkCallback_addFiles(results);
            resolve(true);
        } else {
            // walk through next directory
            walkCallback_addFiles(results);
            const next = nextDirs.shift();
            walk(next!, (errNew, res) => {
                walkCallback(errNew!, res!, resolve, reject, nextDirs);
            });
        }
    }
};

function walkCallback_addFiles(results: result[]) {
    if (files) {
        files = files.concat(editFiles(results));
    } else {
        files = editFiles(results);
    }
}

export function getFile(dir: string, fileName: string) {
    const searchFiles = files?.slice() ?? [];
    const temp = searchFiles.filter(
        (x) =>
            x.path.endsWith(dir + "/" + fileName) ||
            (x.directory == dir && x.name == fileName),
    );
    return temp;
}

async function addCounters() {}

// create hash based off file location
export function createHash(str: string): string {
    let hash = crypto.createHash("md5");
    hash.setEncoding("hex");
    hash.write(str);
    hash.end();
    let sum = hash.read();
    return sum;
}

/**
 * convert files into pathableItem type for readability
 */
export async function formatFiles(root = "/"): Promise<pathableItem<"folder">> {
    root = stripFolder(root).join("/");
    const data: pathableItem<"folder"> = {
        type: "folder",
        name: root,
        directory: root,
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
            children: [],
            hash: file.hash,
        };

        if (parents.length == 0) {
            data.children.push(newFile);
        } else {
            formatFileSubfolder(data, parents, newFile);
        }
    }

    const sizefix = fixFolderSizes(data);
    const dlfix = await fixFileDownloads(sizefix);
    const pathfix = fixPaths(dlfix, root);
    const locationFix = fixLocation(pathfix);
    return locationFix as pathableItem<"folder">;
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
            found.push(str);
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

function fixPaths(data: pathableItem, root: string) {
    for (let child of data.children) {
        if (child.type == "folder") {
            child.directory = root + "/" + child.name;
            child = fixPaths(child, child.directory);
        } else {
            child.directory = data.directory;
        }
    }
    return data;
}

function fixFolderSizes(data: pathableItem) {
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

async function fixFileDownloads(data: pathableItem) {
    for (let child of data.children) {
        if (child.type == "folder") {
            child = await fixFileDownloads(child);
        } else {
            child.downloadCount = await downloadGet(
                child.directory,
                child.name,
            );
        }
    }
    return data;
}

function fixLocation(data: pathableItem) {
    const name = data.name;
    while (data.children.length == 1 && data.children[0].type == "folder") {
        data = data.children[0];
    }
    data.name = name;
    return data;
}
