import * as crypto from "crypto";
export function fileNameSeparate(path: string) {
    const patharray = path.split("/");
    const filename = patharray.pop()!;
    const pathonly = patharray.join("/")! + "/";
    const extension = filename.split(".").pop()!;
    return {
        filename,
        path: pathonly,
        extension,
    };
}

export function relativePath(path: string, root: string = "/files") {
    if (path.includes(root)) {
        const split = path.split(root);
        split.shift();
        return split.join(root);
    }
    return path;
}

export function fixWindowsPath(path: string) {
    return path.replaceAll("\\", "/");
}

export function createHash(str: string): string {
    let hash = crypto.createHash("md5");
    hash.setEncoding("hex");
    hash.write(str);
    hash.end();
    let sum = hash.read();
    return sum;
}
