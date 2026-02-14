import type { pathableItem } from "$lib/data/files";
import { formatFiles, updateFiles } from "$lib/server/files";
import { type ServerLoadEvent } from "@sveltejs/kit";

export const load = async (event: ServerLoadEvent) => {
    updateFiles();
    let returnfiles: pathableItem<"folder"> = await formatFiles(
        event.url.pathname,
    );
    if (!returnfiles) {
        returnfiles = await formatFiles();
    }
    console.log(returnfiles);
    return {
        files: returnfiles,
        isChild: event.url.pathname != "/",
    };
};
