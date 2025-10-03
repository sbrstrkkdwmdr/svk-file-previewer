import { UrlParser } from "$lib/tools";
import { error, type ClientInit, type Reroute } from "@sveltejs/kit";

/**
 * subdomain handling
*/
export const reroute: Reroute = ({ url }) => {
    // const path = url.pathname.split('/');
    // const file = path.pop();
    // if file and no built-in previewer, return file buffer
    // if (file && isPublicFile(url.pathname) && file.includes('.') && fileIsBuffer(file)) {
    //     const temp = `/raw${url.pathname}`;
    //     console.log(temp);
    //     return temp;
    // }


    return `/public${url.pathname}`;
};

const previewed = [
    'md'
];

function fileIsBuffer(path: string) {
    for (const t of previewed) {
        if (path.endsWith('.' + t)) return false;
    }
    return true;
}

function isPublicFile(path: string) {
    if (path.startsWith('/app')) return true;
    return false;
}