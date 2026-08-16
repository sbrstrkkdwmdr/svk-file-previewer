import { toCapital } from "$lib/tools";
import { getMime } from "./filetypes";

export const codeDict = {
    "arm-asm": ["asm"],
    bash: ["sh"],
    c: ["c"],
    cmd: ["bat", "btm", "cmd"],
    cpp: ["cpp", "h"],
    cs: ["cs"],
    css: ["css"],
    dart: ["dart"],
    ejs: ["ejs"],
    gd: ["gd", "tscn"],
    go: ["go"],
    haskell: ["hs", "lhs"],
    handlebars: ["hbs"],
    html: ["html"],
    java: ["java"],
    js: ["js", "cjs", "mjs"],
    json: ["json", "jsonc"],
    jupyter: ["ipynb"],
    kotlin: ["kt", "kts", "kexe", "klib"],
    latex: ["tex"],
    lua: ["lua"],
    matlab: ["m", "matlab"],
    php: ["php", "php3", "php4"],
    powershell: ["ps1", "psm1", "psd1", "ps1xml", "pssc", "cdxml"],
    py: ["py", "pyt", "pyc"],
    r: ["r"],
    reactjsx: ["jsx"],
    reacttsx: ["tsx"],
    rs: ["rs"],
    ruby: ["rb"],
    sass: ["sass", "scss"],
    sql: ["sql", "sqlite"],
    svelte: ["svelte"],
    swift: ["swift"],
    ts: ["ts"],
    vue: ["vue"],
    xml: ["xml"],
};

function dictionaryAVToArray(dict: object) {
    let temp: any[] = [];
    for (const key in dict) {
        const values = dict[key as keyof typeof dict] as any[];
        temp = temp.concat(values as any[]);
    }
    return temp;
}

const previewables = ["md", "log", "txt"].concat(dictionaryAVToArray(codeDict));

const extensions = {
    Image: ["png", "jpg", "svg", "jpeg", "gif", "pdn", "heic", "webp"],
    Video: ["mp4", "mkv", "mov", "avi"],
    Audio: ["mp3", "ogg", "wav", "flac", "aac"],
    Text: ["txt", "log", "osb", "osu", "m", "hbs", "asm"],
    Archive: ["zip", "rar", "osk", "7z", "osz", "xpi", "tar.gz", "tar"],
    Executable: ["exe"],
    Installer: ["msi", "apk"],
    markdown: ["md"],
    db: ["sql"],
    ...codeDict,
};
const extensions_full = {
    "osu! Beatmap archive": ["osz"],
    "osu! Skin archive": ["osk"],
    "osu! Beatmap": ["osu"],
    "osu! storyboard": ["osb"],
    "osu! replay": ["osr"],
    ...extensions,
};

/**
 * icon value
 */
export function getFileIcon(str: string) {
    str = str.toLowerCase();
    let p = "file";
    for (const key in extensions) {
        //@ts-expect-error string cannot index extensions
        if (extensions[key].some((x) => str.endsWith("." + x))) {
            p += key;
            break;
        }
    }
    if (p == "file") {
        const mime = getMime(str);
        for (const str of ["image", "audio", "video", "text"]) {
            if (mime.startsWith(str)) {
                p = "file" + toCapital(str);
            }
        }
        if (p == "file") {
            p += "Generic";
        }
    }
    return p;
}
