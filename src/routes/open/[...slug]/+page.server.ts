import { codeDict } from "$lib/data/extensions";
import type { file, pathableItem } from "$lib/data/files";
import { markdownParse } from "$lib/marked";
import { getMime } from "$lib/MIME";
import { downloadGet } from "$lib/server/database";
import { files as tf, toPathableItem, updateFiles } from "$lib/server/files";
import { error, json, redirect, type ServerLoadEvent } from "@sveltejs/kit";
import fs from "fs";

type mode =
    | "disabled"
    | "folder"
    | "markdown"
    | "file"
    | "code"
    | "text"
    | "image"
    | "audio"
    | "video";

function previewSupport(mime: string) {
    const startswith = ["text", "image", "audio", "video"];
    const endswith = ["markdown"];
    for (const m of startswith) {
        if (mime.startsWith(m)) return true;
    }
    for (const m of endswith) {
        if (mime.endsWith(m)) return true;
    }
    return false;
}

async function previews(ctn: FileReturn, mime: string) {
    let mode: mode = "file";
    let text = "";
    let mdtext = "";
    let lang = "";
    if (mime.includes("markdown")) {
        mode = "markdown";
        text = ctn.content.toString();
        mdtext = await markdownParse(ctn.content.toString());
        // text = ctn.toString('utf-8');
    } else if (isCode(ctn.metadata.name)) {
        mode = "code";
        lang = getLang(ctn.metadata.name);
        text = ctn.content.toString("utf-8");
    } else if (mime.startsWith("text")) {
        mode = "text";
        text = ctn.content.toString("utf-8");
    } else if (mime.startsWith("image")) {
        mode = "image";
    } else if (mime.startsWith("audio")) {
        mode = "audio";
    } else if (mime.startsWith("video")) {
        mode = "video";
    }
    return { mode, text, mdtext, lang };
}

export const load = async (event: ServerLoadEvent) => {
    updateFiles();
    let returnfiles: pathableItem<"folder">;
    let mode: mode = "folder";
    let text = "";
    let mdtext = "";
    let lang = "";
    const hash = event.params.slug;
    const ctn = await getFileHash(hash ?? "");
    const mime = getMime((ctn as FileReturn)?.metadata?.name ?? "");

    if (ctn instanceof Error) {
        const err = ctn as Error;
        return error(+err.name, err.message);
    } else if (previewSupport(mime)) {
        if(ctn.hasData){
            const pre = await previews(ctn, mime);
            [mode, text, mdtext, lang] = [pre.mode, pre.text, pre.mdtext, pre.lang];
        } else {
            mode = "disabled";
        }
    } else {
        mode = "file";
    }

    //@ts-expect-error returnfiles being used before assigned - intended behaviour
    if (!returnfiles) {
        returnfiles = await toPathableItem(ctn.metadata.directory);
    }

    let dlc = await downloadGet(ctn.metadata.hash);

    return {
        files: returnfiles,
        preview: {
            mode,
            text,
            mdtext,
            lang,
            disabled: !ctn.hasData,
        },
        // buffer: ctn,
        mime,
        metadata: (ctn as FileReturn).metadata,
        downloadCount: dlc,
        isChild:
            ctn.metadata.directory != "/" && ctn.metadata.directory.length != 0,
    };
};

type FileReturn = {
    content: Buffer<ArrayBufferLike>;
    message: string;
    metadata: file;
    hasData: boolean;
};

async function getFile(dir: string, file: string) {
    if (!file.includes(".")) {
        const err = new Error("400");
        err.name = "400";
        err.message = "Not a file";
        return err;
    }
    let tfile: file | null = null;
    for (const sf of tf ?? []) {
        if (sf.path == dir + file) tfile = sf;
    }
    if (tfile) {
        let content: Buffer;
        let usepath = "./files/" + tfile.path;
        while (usepath.includes("//")) usepath = usepath.replaceAll("//", "/");
        if (fs.existsSync(usepath)) {
            content = fs.readFileSync(usepath);
        }
        // @ts-expect-error content being used before it's assigned
        if (!content) {
            const err = new Error("500");
            err.name = "500";
            err.message = "Could not fetch from file storage";
            return err;
        }
        return { content, metadata: tfile };
        // return json({ "msg": "skissue" });
    }
    // force file previewer mode
    const err = new Error("500");
    err.name = "404";
    err.message = "Could not find file matching: " + dir + file;
    return err;
}

async function getFileHash(hash: string): Promise<Error | FileReturn> {
    let tfile: file | null = null;
    for (const sf of tf ?? []) {
        if (sf.hash == hash) tfile = sf;
    }
    if (tfile) {
        let content: Buffer;
        let message = "";
        let hasData: boolean = false;
        let usepath = "./files/" + tfile.path;
        while (usepath.includes("//")) usepath = usepath.replaceAll("//", "/");
        if (fs.existsSync(usepath)) {
            const data = fs.statSync(usepath);
            // only pass data if less than 50MB
            if (data.size < 5e7) {
                content = fs.readFileSync(usepath);
                hasData = true;
            } else {
                content = Buffer.from([]);
                message = "File too large";
                hasData = false;
            }
        } else {
            const err = new Error("500");
            err.name = "500";
            err.message = "Could not fetch from file storage";
            message = "Could not find file data";
            hasData = false;
            return err;
        }
        return { content, message, metadata: tfile, hasData };
        // return json({ "msg": "skissue" });
    }
    // force file previewer mode
    const err = new Error("500");
    err.name = "404";
    err.message = "Could not find file matching: " + hash;
    return err;
}

function isCode(file: string) {
    return Boolean(getLang(file));
}

function getLang(file: string) {
    for (const lang in codeDict) {
        for (const ext of codeDict[lang as keyof typeof codeDict]) {
            if (file.toLowerCase().endsWith("." + ext)) return fix(lang);
        }
    }
    return "";
}

function fix(lang: string) {
    const dict = {
        "shell-session": ["cmd", "bat"],
        gdscript: ["gd"],
        jsx: ["reactjsx"],
        tsx: ["reacttsx"],
        rust: ["rs"],
        html: ["svelte"],
    };
    for (const key in dict) {
        if (dict[key as keyof typeof dict].includes(lang)) return key;
    }
    return lang;
}
