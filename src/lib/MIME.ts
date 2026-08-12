import mime, { Mime } from "mime";
import other from "mime/types/other.js";
import standard from "mime/types/standard.js";
import type { Dict } from "./data/types";
import { codeDict } from "./data/extensions";
const customExtensions: Dict<string[]> = {
    "application/dart": ["dart"],
    "application/json": ["ipynb", "json", "map"],
    "application/x-gdscript": ["gd"],
    "application/x-powershell": ["ps1", "psm1", "psd1"],
    "application/x-sh": ["sh"],
    "application/x-sqlite3": ["sqlite3"],
    "application/x-typescript": ["ts"],
    "application/x-xpinstall": ["xpi"],
    "text/html": ["html", "svelte"],
    "text/ini": ["ini", "tscn"],
    "text/java": ["java"],
    "text/javascript": ["js", "cjs", "mjs", "jsonc"],
    "text/jsx": ["tsx"],
    "text/rust": ["rs"],
    "text/plain": [
        "txt",
        "text",
        "conf",
        "def",
        "list",
        "log",
        "in",
        // ---
        "ejs",
        "hbs",
        "vue",
    ],
    "text/typescript-tsx": ["tsx"],
    "text/x-asm": ["asm"],
    "text/x-assembly": ["asm"],
    "text/x-bat": ["bat", "btm", "cmd"],
    "text/x-c": ["c"],
    "text/x-c++src": ["cpp"],
    "text/x-c++hdr": ["h"],
    "text/x-chdr": ["h"],
    "text/x-csharp": ["cs"],
    "text/x-dart": ["dart"],
    "text/x-gdscript": ["gd"],
    "text/x-go": ["go"],
    "text/x-haskell": ["hs", "lhs"],
    "text/x-kotlin": ["kt", "kts"],
    "text/x-literate-haskell": ["lhs"],
    "text/x-lua": ["lua"],
    "text/x-octave": ["matlab", "m"],
    "text/x-php": ["php", "php3", "php4"],
    "text/x-powershell": ["ps1", "psm1"],
    "text/x-python": ["py"],
    "text/x-rsrc": ["r"],
    "text/x-ruby": ["rb", "ruby"],
    "text/x-rust": ["rs"],
    "text/x-sass": ["sass"],
    "text/x-scss": ["scss"],
    "text/x-sh": ["sh"],
    "text/x-swift": ["swift"],
    "text/x-tex": ["tex"],
    "text/x-typescript": ["ts"],
    "x-osu-beatmap-archive": ["osz"],
    "x-osu-skin-archive": ["osk"],
    "x-osu-beatmap": ["osu"],
    "x-osu-storyboard": ["osb"],
    "x-osu-replay": ["osr"],
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
    return out ?? "application/octet-stream";
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
