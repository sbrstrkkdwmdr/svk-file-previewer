export const code = ["c", "cpp", "cs", "go", "html", "css", "js", "ts", "py"];

export const previewables = ["md", "log", "txt"].concat(code);

export const extensions = {
    Image: ["png", "jpg", "svg", "jpeg", "gif", "pdn", "heic"],
    Video: ["mp4", "mkv", "mov", "avi"],
    Audio: ["mp3", "ogg", "wav", "flac", "aac"],
    Text: ["txt", "md", "log", "js", "html", "ts", "osb", "osu"],
    Archive: ["zip", "rar", "osk", "7z", "osz", "xpi", "tar.gz", "tar"],
    Executable: ["exe"],
    Installer: ["msi", "apk"],
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
