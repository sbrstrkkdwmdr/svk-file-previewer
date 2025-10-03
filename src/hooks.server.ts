import { setupDb } from "$lib/server/database";
import { updateFiles } from "$lib/server/files";
import type { ServerInit } from "@sveltejs/kit";

export const init: ServerInit = async () => {
    setupDb();
    updateFiles();
};
