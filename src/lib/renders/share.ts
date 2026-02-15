import type { pathableItem } from "$lib/data/files";
import { UrlParser } from "$lib/tools";

export function getLink(
    item: { hash: string; name?: string },
    mode: "preview" | "download",
) {
    if (mode == "download") {
        let url = `/api/download/${item.hash}`;
        // some files have names with #s and other funky characters that break URLs
        if (item.name) url += `/${encodeURIComponent(item.name)}`; 
        return url;
    }
    return `/open/${item.hash}`;
}
