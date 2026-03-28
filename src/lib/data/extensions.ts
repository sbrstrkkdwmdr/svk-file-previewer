export const codeDict = {
    "arm-asm": ["asm"],
    bash: ["sh"],
    c: ["c"],
    cmd: ["bat", "btm", "cmd"],
    cpp: ["cpp", "h"],
    cs: ["cs"],
    css: ["css"],
    dart: ["dart"],
    gd: ["gd"],
    go: ["go"],
    haskell: ["hs", "lhs"],
    handlebars: ["hbs"],
    html: ["html"],
    java: ["java"],
    js: ["js", "cjs", "mjs"],
    json: ["json"],
    jupyter: ["ipynb"],
    kotlin: ["kt", "kts", "kexe", "klib"],
    latex: ["tex"],
    lua: ["lua"],
    matlab: ["m"],
    php: ["php"],
    powershell: ["ps1", "psm1", "psd1", "ps1xml", "pssc", "cdxml"],
    py: ["py", "pyt"],
    r: ["r"],
    reactjsx: ["jsx",],
    reacttsx: ["tsx"],
    rs: ["rs"],
    ruby: ["rb"],
    sass: ["sass", "scss"],
    sql: ["sql", "sqlite"],
    svelte: ["svelte"],
    swift: ["swift"],
    ts: ["ts"],
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

export const previewables = ["md", "log", "txt"].concat(
    dictionaryAVToArray(codeDict),
);

export const extensions = {
    Image: ["png", "jpg", "svg", "jpeg", "gif", "pdn", "heic"],
    Video: ["mp4", "mkv", "mov", "avi"],
    Audio: ["mp3", "ogg", "wav", "flac", "aac"],
    Text: ["txt", "log", "osb", "osu"],
    Archive: ["zip", "rar", "osk", "7z", "osz", "xpi", "tar.gz", "tar"],
    Executable: ["exe"],
    Installer: ["msi", "apk"],
    markdown: ["md"],
    ...codeDict,
};
export const extensions_full = {
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
export function extToImage(str: string) {
    str = str.toLowerCase();
    let p = "file";
    for (const key in extensions) {
        //@ts-expect-error string cannot index extensions
        if (extensions[key].some((x) => x == str)) {
            p += key;
            break;
        }
    }
    if (p == "file") {
        p += "Generic";
    }
    return p;
}
export function extToType(str: string) {
    str = str.toLowerCase();
    let p = "file";
    for (const key in extensions_full) {
        //@ts-expect-error string cannot index extensions
        if (extensions_full[key].some((x) => x == str)) {
            p = key;
            break;
        }
    }
    return p.toLowerCase();
}
