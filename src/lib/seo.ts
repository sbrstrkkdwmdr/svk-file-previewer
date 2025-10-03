import { UrlParser } from "./tools";

export function robotsText(parser: UrlParser): string {
    const sitemapurl = parser.customUrl({ path: '/sitemap.xml' });
    return 'User-Agent: *\nDisallow: /\n' + '\n\nSitemap: ' + sitemapurl;
}

export function toSitemap(urls: string[]) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">    
${urls.map(x => '<url><loc>' + x + '</loc></url>').join('\n')}
</urlset>`;
}

export function getUrls(url: URL) {
    return [];
}