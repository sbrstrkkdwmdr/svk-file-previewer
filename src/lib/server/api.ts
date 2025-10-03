import type { file } from "$lib/data/files";
import { getMime } from "$lib/MIME";
import { getUrls, robotsText, toSitemap } from "$lib/seo";
import { downloadGet, downloadUpdate } from "$lib/server/database";
import { files, updateFiles } from "$lib/server/files";
import { UrlParser } from "$lib/tools";
import type { RequestHandler } from "@sveltejs/kit";
import { error, json, redirect } from '@sveltejs/kit';
import * as fs from 'fs';
import ping from "ping";
/**
 * redirect to specific subdomain
 */
export const subdomainRedirect: RequestHandler = (event) => {
    const parser = new UrlParser(event.url.href);
    let path = event.url.searchParams.get('path')!;
    const sbd = event.url.searchParams.getAll('subdomain')!;
    if (!path) {
        return error(400, "Missing parameters. Please make sure `path` and `subdomain` params are included in the URL");
    }
    if (!path.startsWith('/')) path = '/' + path;
    const url = parser.customUrl({
        subdomains: sbd,
        path,
        params: ''
    });
    // return json({
    //     url
    // });
    return redirect(308, url);
};


export const downloadFileGET: RequestHandler = async ({ url }) => {
    await updateFiles();
    const file = url.searchParams.get('name') as string;
    const dir = url.searchParams.get('location') as string;
    const preview = url.searchParams.get('preview') as string;
    let tfile: file | null = null;
    for (const sf of files ?? []) {
        if (sf.rel == dir + file) tfile = sf;
    }
    if (tfile) {
        downloadUpdate(dir, file);
        let content: NonSharedBuffer | null = null;
        if (fs.existsSync('./files/' + tfile.rel)) content = fs.readFileSync('./files/' + tfile.rel);
        if (!content) {
            error(500, { "message": "Could not fetch from file storage" });
        }
        const res = new Response(content, {
            status: 200,
            headers: {
            },
        });
        if (preview == 'true') {
            const mimetype = getMime(tfile.fName);
            res.headers.set("Content-Type", mimetype);
            res.headers.set("Content-Length", content.byteLength + '');
        } else {
            res.headers.set("Content-Disposition", "attachment; filename=" + tfile.fName);
        }

        return res;
        // return json({ "msg": "skissue" });
    }
    return error(404, { "message": "File not found" });
};

export const sitemapGET: RequestHandler = async ({ url }) => {
    const urls = getUrls(url);
    const sitemapdata = toSitemap(urls);
    let content = Buffer.from(sitemapdata, 'utf-8');
    const res = new Response(content, {
        status: 200,
        headers: {
            "Content-Type": "application/xml"
        },
    });
    return res;
};

export const robotstxtGET: RequestHandler = async ({ url }) => {
    const data = robotsText(new UrlParser(url.href));
    let content = Buffer.from(data, 'utf-8');
    const res = new Response(content, {
        status: 200,
        headers: {
            "Content-Type": "text/plain"
        },
    });
    return res;
};

export const downloadCountGET: RequestHandler = async ({ url }) => {
    await updateFiles();
    const file = url.searchParams.get('name') as string;
    const dir = url.searchParams.get('location') as string;
    const number = await downloadGet(dir, file);
    const res = json({ "number": number });
    return res;
};


export const boo: RequestHandler = async ({ url }) => {
    const data = "boo!";
    let content = Buffer.from(data, 'utf-8');
    const res = new Response(content, {
        status: 200,
        headers: {
            "Content-Type": "text/plain"
        },
    });
    return res;
};

/**
 * 
 * @param host web origin or IP address. exclude protocol
 */
export async function getPing(host: string="sbrstrkkdwmdr.me") {
    const promise = await ping.promise.probe(host);

    return {
        alive: promise.alive,
        times: promise.times,
        loss: +promise.packetLoss,
        avg: +promise.avg,
        stddev: +promise.stddev,
    };
}

export const pingGET: RequestHandler= async ({ url }) => {
    const param = url.searchParams.get('host');
    const data = getPing(param ?? undefined);
    return json(data);
};
