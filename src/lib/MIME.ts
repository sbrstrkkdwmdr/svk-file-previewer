import mime, { Mime } from "mime";
import other from 'mime/types/other.js';
import standard from "mime/types/standard.js";
import type { Dict } from "./data/types";

const customExtensions: Dict<string[]> = {
    'application/zip': ['osk', 'osz', 'osb']
};

export function getMime(filename: string) {
    const ext = toExtension(filename);
    // const out = mime.getType(ext);
    const out = new Mime(standard, other).getType(ext);
    return out ?? 'application/octet-stream';
}

function toExtension(filename: string) {
    if (filename.includes('.')) {
        const temp = filename.split('.');
        return temp.pop()!;
    }
    return filename;
}
export function isPreviewable(filename: string) {
    const extensions: string[] = [
        'jpg', 'jpeg',
        'gif',
        'png', 
        'svg',
        
        'txt',
        'css',
        'md',
    ];
    return extensions.includes(toExtension(filename));
}
