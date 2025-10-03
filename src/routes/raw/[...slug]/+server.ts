import type { file } from "$lib/data/files";
import { getMime } from "$lib/MIME";
import { downloadUpdate } from "$lib/server/database";
import { files, updateFiles } from "$lib/server/files";
import type { RequestHandler } from "@sveltejs/kit";
import { error } from '@sveltejs/kit';
import fs from 'fs';

export const GET: RequestHandler = async ({ url, params }) => {
    const slug = params.slug;
    if(!slug) error(400, "Missing file params")
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
        if (fs.existsSync('./shareables/' + tfile.rel)) content = fs.readFileSync('./shareables/' + tfile.rel);
        if (fs.existsSync('./static/' + tfile.rel)) content = fs.readFileSync('./static/' + tfile.rel);
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