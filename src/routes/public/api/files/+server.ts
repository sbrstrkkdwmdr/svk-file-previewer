import type { file } from "$lib/data/files";
import { files, updateFiles } from "$lib/server/files";
import type { RequestHandler } from "@sveltejs/kit";
import { json } from '@sveltejs/kit';
import * as fs from 'fs';
export const GET: RequestHandler = ({ url }) => {
    updateFiles();
    const temp: string[] = [];
    if (files) {
        for (const file of files) {
            temp.push(file.path);
        }
    }
    return json(temp);
};