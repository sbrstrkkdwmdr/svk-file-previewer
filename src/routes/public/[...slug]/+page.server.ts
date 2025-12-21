import { code } from "$lib/data/extensions";
import type { file, pathableItem } from "$lib/data/files";
import { markdownParse } from "$lib/marked";
import { getMime } from "$lib/MIME";
import { downloadGet } from "$lib/server/database";
import { files as tf, updateFiles } from "$lib/server/files";
import { error, json, redirect, type ServerLoadEvent } from "@sveltejs/kit";
import fs from 'fs';
export const load = async (event: ServerLoadEvent) => {
    updateFiles();
    let returnfiles: pathableItem<"folder">;
    let mode: 'folder' | 'markdown' | 'file' | 'code' = 'folder';
    let text = '';
    let lang = '';
    const floc = event.url.pathname.split("/");
    const fname = floc.pop()!;
    const ctn = await getFile(floc.join('/') + '/', fname);
    const mime = getMime(fname);
    if (Error.isError(ctn)) {
        if ((ctn as Error).name.startsWith('40')) {
            returnfiles = await formattedFiles(event.url.pathname);
            mode = 'folder';
        } else {
            const err = ctn as Error;
            return error(+err.name, err.message);
        }
    } else if (mime.includes('markdown')) {
        mode = 'markdown';
        text = await markdownParse(ctn.toString());
        // text = ctn.toString('utf-8');
    } else if (isCode(fname)) {
        mode = 'code';
        lang = getLang(fname);
        text = ctn.toString('utf-8');
    } else {
        mode = 'file';
        text = ctn.toString('utf-8');
    }
    //@ts-expect-error returnfiles being used before assigned - intended behaviour
    if (!returnfiles) {
        returnfiles = await formattedFiles();
    }
    return {
        files: returnfiles,
        mode,
        text,
        lang,
        // buffer: ctn
    };
};
async function formattedFiles(root = '/'): Promise<pathableItem<"folder">> {
    if (root == '/') root = '';
    const files = tf;
    // if (!root.startsWith('/')) root = '/' + root;
    // if (!root.endsWith('/')) root += '/';
    // TODO - path should be /
    const data: pathableItem<"folder"> = {
        type: 'folder',
        name: root,
        path: root,
        children: [],
        size: 0,
        hash: ""
    };
    if (!files) return data;
    for (const file of files) {
        const filesplit = file?.rel?.split(root + '/');
        let curpos = filesplit[1];
        if (!curpos) continue;
        const parentDirs: string[] = (() => {
            if (curpos.includes('/')) return curpos.split('/');
            if (root == '') {
                const temp = file.rel.split('/');
                temp.shift();
                return temp;
            }
            return [];
        })();
        parentDirs.length > 0 ? parentDirs.pop() : null;
        const newFile: pathableItem = {
            type: 'file',
            name: file.fName,
            path: file.aUrl.replace(file.fName, ''),
            size: file.size,
            children: [],
            hash: file.hash,
        };
        if (parentDirs.length == 0) {
            data.children.push(newFile);
        } else if (parentDirs.length == 1) {
            const temp = data.children.slice().filter(x => x.type == 'folder').map(x => x.name);
            if (temp.includes(parentDirs[0])) {
                const get = data.children.find(x => x.name == parentDirs[0])!;
                get.children.push(newFile);
            } else {
                data.children.push({
                    type: 'folder',
                    name: parentDirs[0],
                    path: root,
                    children: [newFile],
                    size: 0,
                    hash: "",
                });
            }
        } else {
            let top = data.children.slice().filter(x => x.type == 'folder').map(x => x.name);
            let gt: pathableItem;
            if (top.includes(parentDirs[0])) {
                gt = data.children.find(x => x.name == parentDirs[0])!;
            } else {
                gt = {
                    type: 'folder',
                    name: parentDirs[0],
                    path: root,
                    children: [],
                    size: 0,
                    hash: "",
                };
                data.children.push(gt);
            }
            for (let i = 1; i < parentDirs.length; i++) {
                top = gt.children.slice().filter(x => x.type == 'folder').map(x => x.name);
                let temp: pathableItem;
                if (top.includes(parentDirs[i])) {
                    temp = gt.children.find(x => x.name == parentDirs[i])!;
                } else {
                    temp = {
                        type: 'folder',
                        name: parentDirs[i],
                        path: root,
                        children: [],
                        size: 0,
                        hash: "",
                    };
                    gt.children.push(temp);
                }
                if (i == parentDirs.length - 1) {
                    temp.children.push(newFile);
                }
                gt = temp;
            }
        }
    }
    const sizefix = fixFolderSizes(data);
    const dlfix = await fixFileDownloads(sizefix);
    const pathfix = fixPaths(dlfix, root);
    return pathfix as pathableItem<"folder">;
}

function fixPaths(data: pathableItem, root: string) {
    for (let child of data.children) {
        if (child.type == 'folder') {
            child.path = root + '/' + child.name;
            child = fixPaths(child, child.path);
        } else {
            child.path = data.path;
        }
    }
    return data;
}

function fixFolderSizes(data: pathableItem) {
    let n = 0;
    for (let child of data.children) {
        if (child.type == 'folder') {
            child = fixFolderSizes(child);
        }
        n += child.size;
    }
    data.size = n;
    return data;
}

async function fixFileDownloads(data: pathableItem) {
    for (let child of data.children) {
        if (child.type == 'folder') {
            child = await fixFileDownloads(child);
        } else {
            child.downloadCount = await downloadGet(child.path, child.name);
        }
    }
    return data;
}

async function getFile(dir: string, file: string) {
    if (!file.includes('.')) {
        const err = new Error('400');
        err.name = '400';
        err.message = "Not a file";
        return err;
    }
    let tfile: file | null = null;
    for (const sf of tf ?? []) {
        if (sf.rel == dir + file) tfile = sf;
    }
    if (tfile) {
        let content: Buffer;
        let usepath = './files/' + tfile.rel;
        while (usepath.includes('//')) usepath = usepath.replaceAll('//', '/');
        if (fs.existsSync(usepath)) {
            content = fs.readFileSync(usepath);
        }
        // @ts-expect-error content being used before it's assigned
        if (!content) {
            const err = new Error('500');
            err.name = '500';
            err.message = "Could not fetch from file storage";
            return err;
        }
        return content;
        // return json({ "msg": "skissue" });
    }
    // force file previewer mode
    const err = new Error('500');
    err.name = '404';
    err.message = "Could not find markdown file matching: " + dir + file + '.md';
    return err;
}

function isCode(file: string) {
    for (const ext of code) {
        if (file.endsWith('.' + ext)) return true;
    }
    return false;
}

function getLang(file: string) {
    for (const ext of code) {
        if (file.endsWith('.' + ext)) return ext;
    }
    return '';
}