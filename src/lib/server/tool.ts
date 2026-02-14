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
