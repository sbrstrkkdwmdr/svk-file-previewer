import type { file } from "$lib/data/files";
import { getMime } from "$lib/MIME";
import { UrlParser } from "$lib/tools";
import type { LayoutServerLoad } from "../../routes/$types";
import { files } from "./files";
// import type { LayoutServerLoad } from
export const load: LayoutServerLoad = async (ld) => {
    const parser = new UrlParser(ld.url.href);
    let colourMode: colourMode = validateColourmode(
        ld.cookies.get("colourMode"),
    );
    if (!ld.cookies.get("colourMode"))
        ld.cookies.set("colourMode", "dark_default", { path: "/" });
    return {
        headmeta: toMetaData(parser, ld.url),
        colourMode,
    };
};

type colourMode = "dark_default" | "light_default";

const colourModes: colourMode[] = ["dark_default", "light_default"];

function validateColourmode(str: string | undefined): colourMode {
    if (str) {
        for (const elem of colourModes) {
            if (elem == str) return str;
        }
    }
    return "dark_default";
}

function toMetaData(parser: UrlParser, url: URL) {
    const type = url.pathname.startsWith("/open/") ? "file" : "folder";
    const path = url.pathname.split("/");
    if (type == "file") {
        let tfile: file | null = null;
        for (const sf of files ?? []) {
            if (sf.hash == path[2]) {
                tfile = sf;
                break;
            }
        }
        const fname = `File preview - ${tfile?.name ?? "unknown"}`;
        const mime = getMime(fname);
        return `<title>${fname}</title>
<meta content="${fname}" property="og:title" />
<meta content="File preview - ${mime}" property="og:description" />
<meta content="${parser.href}" property="og:url" />
<meta content="${url.origin}/icons/favicon-64x64.png" property="og:image" />
<meta content="#FF1921" data-react-helmet="true" name="theme-color" />`;
    }
    const fname = `Folder preview - ${path.join("/") ?? "unknown"}`;
    return `<title>${fname}</title>
<meta content="${fname}" property="og:title" />
<meta content="Folder preview" property="og:description" />
<meta content="${parser.href}" property="og:url" />
<meta content="${url.origin}/icons/favicon-64x64.png" property="og:image" />
<meta content="#FF1921" data-react-helmet="true" name="theme-color" />`;
}
