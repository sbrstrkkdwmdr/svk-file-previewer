import type { RequestHandler } from "@sveltejs/kit";
import { redirect, type ServerLoadEvent } from "@sveltejs/kit";
export const GET: RequestHandler = async ({ url }) => {
    return redirect(308, "/");
};
