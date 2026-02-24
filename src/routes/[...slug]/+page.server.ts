import type { pathableItem } from "$lib/data/files";
import { toPathableItem, updateFiles } from "$lib/server/files";
import { type ServerLoadEvent } from "@sveltejs/kit";

export const load = async (event: ServerLoadEvent) => {
    updateFiles();
    let returnfiles: pathableItem<"folder"> = await toPathableItem(
        event.url.pathname,
    );
    if (!returnfiles) {
        returnfiles = await toPathableItem();
    }
    return {
        files: returnfiles,
        isChild: event.url.pathname != "/",
    };
};
