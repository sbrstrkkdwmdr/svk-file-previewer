import type { file, pathableItem } from "$lib/data/files";
import fs from "fs";
import path from "path";
import {
    fileNameSeparate,
    fixWindowsPath,
    relativePath,
} from "$lib/server/tool";
import { TIMER } from "$env/static/private";
import { createHash } from "$lib/server/tool";

let cachefiles: file[] = [];
let workfiles: file[] | null = null;

let fLastUpdate = new Date().getTime();
const rootFolder = "files";
let currentlyUpdating = false;
const fileSyncTimer = +TIMER || 1000 * 60 * 15;
console.log(`Using timer: ${fileSyncTimer / 60e3} minute(s)`);

export function filesLoaded() {
    return currentlyUpdating;
}

export function getFiles() {
    return cachefiles;
}

export async function updateFiles() {
    if (currentlyUpdating) return;
    if (
        !Boolean(workfiles) ||
        Math.abs(fLastUpdate - new Date().getTime()) > fileSyncTimer
    ) {
        currentlyUpdating = true;
        workfiles = null;
        const iso = new Date().toISOString();
        console.log(iso + ": Updating file explorer...");
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
    if ((workfiles?.length ?? -1) > 0 && workfiles?.[0].hash != "error") {
        cachefiles = workfiles!;
    }
    return workfiles;
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
    if (a.directory != b.directory)
        return a.directory.localeCompare(b.directory);
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
        workfiles = [
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
        workfiles = null;
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
    if (workfiles) {
        workfiles = workfiles.concat(editFiles(results));
    } else {
        workfiles = editFiles(results);
    }
}
