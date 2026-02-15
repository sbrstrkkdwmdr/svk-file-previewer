export { downloadFileSlugGET as GET } from '$lib/server/api';
// import { json } from "@sveltejs/kit";

// import type { RequestHandler } from "@sveltejs/kit";

// export const GET: RequestHandler = async ({ params, url }) => {
//     const hash = params.slug;
//     const split = params.slug?.split("/");
//     const nhash = split?.shift();
//     return json({
//         ss: split?.join("/"),
//         hash: nhash,
//         ...params,
//     });
// };
