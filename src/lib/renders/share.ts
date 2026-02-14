import { UrlParser } from "$lib/tools";

export function downloadLink(href?: string) {
    const parsed = new UrlParser(href ?? window.location.href);
    const path = parsed.path.split("/");
    const fname = path.pop()!;
    return (
        "/api/download?name=" +
        encodeURIComponent(fname) +
        "&location=" +
        encodeURIComponent(path.join("/")) +
        "/&preview=true"
    );
}
