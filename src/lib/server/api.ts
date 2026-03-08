import type { file } from "$lib/data/files";
import { getMime } from "$lib/MIME";
import { getUrls, robotsText, toSitemap } from "$lib/seo";
import { downloadGet, downloadUpdate } from "$lib/server/database";
import { createHash, files, updateFiles } from "$lib/server/files";
import { UrlParser } from "$lib/tools";
import type { RequestHandler } from "@sveltejs/kit";
import { error, json, redirect } from "@sveltejs/kit";
import * as fs from "fs";
/**
 * redirect to specific subdomain
 */
export const subdomainRedirect: RequestHandler = (event) => {
    const parser = new UrlParser(event.url.href);
    let path = event.url.searchParams.get("path")!;
    const sbd = event.url.searchParams.getAll("subdomain")!;
    if (!path) {
        return error(
            400,
            "Missing parameters. Please make sure `path` and `subdomain` params are included in the URL",
        );
    }
    if (!path.startsWith("/")) path = "/" + path;
    const url = parser.customUrl({
        subdomains: sbd,
        path,
        params: "",
    });
    // return json({
    //     url
    // });
    return redirect(308, url);
};

export const downloadFileGET: RequestHandler = async ({ url }) => {
    await updateFiles();
    let file = url.searchParams.get("name") as string;
    let dir = url.searchParams.get("location") as string;
    const preview = url.searchParams.get("preview") as string;
    let hash = url.searchParams.get("hash") as string;

    if((dir || file) && !hash){
        return error(500, {
            message:
                "name and location params have been disabled. Use hash.",
        });
    }

    let tfile: file | null = fileFromHash(hash);

    if (tfile) {
        downloadUpdate(tfile.hash);
        let content: NonSharedBuffer | null = getFileContent(tfile);
        return fileResponse(content, !Boolean(preview), tfile)
        // return json({ "msg": "skissue" });
    }
    return error(404, { message: "File not found" });
};

function slugHash(slug: string): string {
    if (slug.includes("/")) {
        const slugsplit = slug.split("/");
        const hash = slugsplit.shift()!;
        if (hash.length > 0) return hash;
    }
    return slug;
}

export const downloadFileSlugGET: RequestHandler = async ({ params, url }) => {
    await updateFiles();
    const hash = slugHash(params.slug ?? "");
    const direct = url.searchParams.get("direct") as string;
    let tfile = fileFromHash(hash);

    if (tfile) {
        downloadUpdate(tfile.hash);
        let content = getFileContent(tfile);
        return fileResponse(content, Boolean(direct), tfile);
    }
    return error(404, { message: "File not found" });
};

export const sitemapGET: RequestHandler = async ({ url }) => {
    const urls = getUrls(url);
    const sitemapdata = toSitemap(urls);
    let content = Buffer.from(sitemapdata, "utf-8");
    const res = new Response(content, {
        status: 200,
        headers: {
            "Content-Type": "application/xml",
        },
    });
    return res;
};

export const robotstxtGET: RequestHandler = async ({ url }) => {
    const data = robotsText(new UrlParser(url.href));
    let content = Buffer.from(data, "utf-8");
    const res = new Response(content, {
        status: 200,
        headers: {
            "Content-Type": "text/plain",
        },
    });
    return res;
};

export const downloadCountGET: RequestHandler = async ({ url }) => {
    await updateFiles();
    // const file = url.searchParams.get("name") as string;
    // const dir = url.searchParams.get("location") as string;
    const hash = url.searchParams.get("hash") as string;
    const number = await downloadGet(hash);
    const res = json({ number: number });
    return res;
};

export const boo: RequestHandler = async ({ url }) => {
    const data = "boo!";
    let content = Buffer.from(data, "utf-8");
    const res = new Response(content, {
        status: 200,
        headers: {
            "Content-Type": "text/plain",
        },
    });
    return res;
};

function fileFromHash(hash: string): file | null {
    // let tfile: file | null = null;
    for (const sf of files ?? []) {
        if (sf.hash == hash) {
            return sf;
        }
    }
    return null;
}

function getFileContent(file: file) {
    let content: NonSharedBuffer | null = null;
    if (fs.existsSync("./files/" + file.path)) {
        content = fs.readFileSync("./files/" + file.path);
    }
    if (!content) {
        return error(500, { message: "Could not fetch from file storage" });
    }
    return content;
}

function fileResponse(content: NonSharedBuffer, isDirect: boolean, file: file) {
    const res = new Response(content, {
        status: 200,
        headers: {},
    });
    const mimetype = getMime(file.name);
    res.headers.set("Content-Type", mimetype);
    res.headers.set("Content-Length", content.byteLength + "");

    // without this header, browsers just show the content of the file
    // pc browsers can still download just fine w/ shortcuts but on mobile its a bit harder esp. for text files
    if (isDirect) {
        res.headers.set(
            "Content-Disposition",
            "attachment; filename=" + encodeURIComponent(file.name),
        );
    }
    return res;
}

export const viewFileSlugGET: RequestHandler = async ({ params, url }) => {
    await updateFiles();
    const hash = slugHash(params.slug ?? "");
    let tfile = fileFromHash(hash);

    if (tfile) {
        let content = getFileContent(tfile);
        return fileResponse(content, false, tfile);
    }
    return error(404, { message: "File not found" });
};


