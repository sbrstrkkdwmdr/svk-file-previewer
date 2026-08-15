import mime, { Mime } from "mime";
import other from "mime/types/other.js";
import standard from "mime/types/standard.js";
import type { Dict } from "$lib/data/types";
import { codeDict } from "$lib/data/extensions";
import { customExtensions } from "./mimetypes";
import { extNames, mimeNames } from "./names";
import { toCapital } from "$lib/tools";
const tempMime = new Mime(standard, other);
tempMime.define(customExtensions, true);

export function getMime(filename: string) {
    const ext = toExtension(filename);
    // mime.define(standard)
    // mime.define(other)
    // mime.define(customExtensions, true);
    // const out = mime.getType(ext);
    // const tempMime = new Mime(standard, other);
    const out = tempMime.getType(ext);
    return out ?? "application/octet-stream";
}

export function fileTypeName(filename: string) {
    const ext = toExtension(filename);
    const otype = extNames[ext];
    if (otype) return otype;
    const mt = getMime(filename);
    const type = mimeNames[mt];
    if (type == null || type == undefined) {
        if (mt.startsWith("application/")) return "Application data";
        if (mt.includes("/")) return toCapital(mt.split("/")[0]) + " file";
        return "Unknown data type";
    }
    return type;
}

function toExtension(filename: string) {
    if (filename.includes(".")) {
        const temp = filename.split(".");
        return temp.pop()!;
    }
    return filename;
}
export function isPreviewable(filename: string) {
    const extensions: string[] = [
        "jpg",
        "jpeg",
        "gif",
        "png",
        "svg",

        "txt",
        "css",
        "md",
    ];
    return extensions.includes(toExtension(filename));
}
