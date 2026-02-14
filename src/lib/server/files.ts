import type { file } from '$lib/data/files';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
type result = { file: string; size: number; };

export let files: file[] | null = null;

let fLastUpdate = new Date().getTime();
const rootFolder = 'files';
let currentlyUpdating = false;
const fileSyncTimer = 1000 * 60 * 60;

export async function updateFiles() {
    if (currentlyUpdating) return;
    if (!Boolean(files) || Math.abs(fLastUpdate - new Date().getTime()) > fileSyncTimer) {
        currentlyUpdating = true;
        files = null;
        console.log('Updating file explorer...');
        fLastUpdate = new Date().getTime();
        await new Promise((resolve, reject) => {
            walk(`./${rootFolder}`, (err, res) => {
                walkCallback(err!, res!, resolve, reject, [/* add more folder paths if necessary */]);
            });
        });
        currentlyUpdating = false;
    }
    return files;
}

// convert all files to somewhat readable format
export function editFiles(results: result[]): file[] {
    const data = results.map(x => {
        let p = x.file.replaceAll('\\', '/');
        return {
            parent: p.split('/')[p.split('/').length - 2],
            fName: p.split('/')[p.split('/').length - 1],
            aUrl: relativePath(p).replaceAll('\\', '/').replace(`../${rootFolder}`, '').replaceAll('../', ''),
            rel: relativePath(p).replaceAll('\\', '/').replace(`./${rootFolder}`, ''),
            size: x.size,
            hash: createHash(p)
        };
    }).sort((a, b) => a.parent.localeCompare(b.parent));
    for (const item of data) {
        if (!item.aUrl.startsWith('/')) item.aUrl = '/' + item.aUrl;
        if (!item.rel.startsWith('/')) item.rel = '/' + item.rel;
    }
    return data;
}

function relativePath(path: string, root: string = '/files') {
    if (path.includes(root)) {
        const split = path.split(root);
        split.shift();
        return split.join(root);
    }
    return path;
}

// modified from stackoverflow
export function walk(dir: string, done: (err?: Error | null, results?: result[]) => void) {
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

const walkCallback = (err: Error, results: result[], resolve: (value?: unknown) => void, reject: (reason?: any) => void, nextDirs: string[]) => {
    if (err) {
        console.log(err);
        files = [
            {
                fName: 'error',
                aUrl: 'error',
                rel: 'error',
                size: 0,
                hash: 'error'
            }
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
    const temp = (searchFiles).filter(x =>
        x.aUrl.endsWith(dir + '/' + fileName)
    );
    return temp;
}

async function addCounters() {

}

// create hash based off file location
export function createHash(str: string): string {
    let hash = crypto.createHash('md5');
    hash.setEncoding('hex');
    hash.write(str);
    hash.end();
    let sum = hash.read();
    return sum;
}