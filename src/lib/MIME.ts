import mime, { Mime } from "mime";
import other from 'mime/types/other.js';
import standard from "mime/types/standard.js";
import type { Dict } from "./data/types";

const customExtensions: Dict<string[]> = {
    'text/javascript': ['cjs', 'js', 'mjs',],
    'text/plain': ['txt', 'ts', 'jsx', 'tsx',],
    'x-osu-beatmap-archive': ['osz'],
    'x-osu-skin-archive': ['osk'],
    'x-osu-beatmap': ['osu'],
    'x-osu-storyboard': ['osb'],
    'x-osu-replay': ['osr'],
};

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
