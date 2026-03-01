import { getIcons } from '$lib/icons';
import type { RequestHandler } from '@sveltejs/kit';
export const GET: RequestHandler = async ({ url }) => {
    const data = getIcons();
    let content = Buffer.from(data, 'utf-8');
    const res = new Response(content, {
        status: 200,
        headers: {
            "Content-Type": "text/css"
        },
    });
    return res;
};