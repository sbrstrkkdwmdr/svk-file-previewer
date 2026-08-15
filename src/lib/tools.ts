import { pushState, replaceState } from "$app/navigation";
import { subdomainoffset } from "$lib/data/std";
import type { Dict } from "$lib/data/types";

export function toCapital(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export class UrlParser {
    private urlObject: URL;
    private subdomainOffset!: number;
    private canHaveSubdomains!: boolean;

    public get href() {
        return this.urlObject.href;
    }
    public set href(v: string) {
        this.urlObject = new URL(v);
        this.parse(v, subdomainoffset);
    }

    public get protocol() {
        return this.urlObject.protocol;
    }
    /**
     * subdomains as an array
     * @example foo.bar.website.com:80/blah -> ["foo", "bar"]
     */
    public get subdomains() {
        return this._subdomains;
    }

    public get origin() {
        return this.urlObject.origin;
    }

    /**
     * subdomains as a string
     * @example foo.bar.website.com:80/blah -> "foo.bar"
     */
    public get subdomain() {
        return this._subdomains.join(".");
    }

    public set subdomains(v: string[]) {
        this._subdomains = v;
    }
    public get primaryDomain() {
        let temp = this.urlObject.hostname;
        for (const sub of this._subdomains) {
            temp = temp.replace(sub + ".", "");
        }
        return temp;
    }
    private _subdomains: string[] = [];
    public get path() {
        return this.urlObject.pathname;
    }
    public get hash() {
        return this.urlObject.hash;
    }
    public get params() {
        return this.urlObject.searchParams;
    }
    public get paramString() {
        return this.urlObject.search;
    }
    public get port() {
        return this.urlObject.port;
    }
    public set port(v: string) {
        this.urlObject.port = v;
    }
    public constructor(url: string, subdomainOffset: number = subdomainoffset) {
        this.urlObject = new URL(url);
        this.parse(url, subdomainOffset);
    }
    private isIp() {
        const sbd = this.urlObject.hostname;
        const temp: number[] = [];
        for (const w of sbd.split(".")) {
            if (!isNaN(+w)) temp.push(+w);
        }
        return temp.join(".") != sbd;
    }
    private parse(url: string, subdomainOffset = subdomainoffset) {
        if (url.includes("localhost")) this.subdomainOffset = 1;
        else this.subdomainOffset = subdomainOffset;
        this.canHaveSubdomains = this.isIp();
        this.setSubdomains();
    }
    private setSubdomains() {
        if (!this.canHaveSubdomains) return;
        const splitDom = this.urlObject.hostname.split(".");
        if (splitDom.length <= this.subdomainOffset) return;
        for (let i = 0; i < this.subdomainOffset; i++) {
            splitDom.pop();
        }
        this._subdomains = splitDom;
    }
    //protocol//sbd.host:port/path{?params}{#hash}
    /**
     * {{protocol}//}{{subdomains}.}{host}{:{port}}{path}{params}{hash}
     */
    public customUrl({
        subdomains = this._subdomains,
        host = this.primaryDomain,
        port = this.port,
        path = this.path,
        params = this.paramString,
        hash = this.hash,
    }): string {
        let url = this.protocol + "//";
        if (subdomains.length > 0) {
            const temp = [];
            for (const subdomain of subdomains) {
                if (subdomain.length > 0) {
                    temp.push(subdomain);
                }
            }
            if (temp.length > 0) {
                url += subdomains.join(".") + ".";
            }
        }
        url += host;
        if (port && port.length > 0) url += ":" + port;
        if (path && path.length > 0) url += path;
        if (params && params.length > 0) url += params;
        if (hash && hash.length > 0) url += hash;
        return url;
    }
    public get isIpAddress() {
        if (this.primaryDomain.includes(".")) {
            let i = 0;
            for (const num of this.primaryDomain.split(".")) {
                if (!isNaN(+num)) {
                    i++;
                }
            }
            if (i === 4) return true;
        }
        return false;
    }
}

export function pushArray<T extends any>(arr: T[], arr2: T[]) {
    for (const elem of arr2) {
        arr.push(elem);
    }
}

export function arrayIsSame<T extends any>(arr: T[], arr2: T[]) {
    if (arr.length != arr2.length) return false;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] != arr2[i]) return false;
    }
    return true;
}

export function keyToIndex(key: string, dict: Dict) {
    const keys = Object.keys(dict);
    for (let i = 0; i < keys.length; i++) {
        if (key == keys[i]) return i;
    }
    return -1;
}

export function fisherYatesShuffle<T extends any>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// special search
export function stringMatches(str: string, search: string) {
    const a = str.toLowerCase();
    const b = search.toLowerCase();
    if (
        (search.startsWith('"') && search.endsWith('"')) ||
        search.startsWith("=")
    ) {
        return (
            a.replaceAll('\"', "") == b.replaceAll('\"', "").replace("=", "")
        );
    }
    if (search.includes("*")) {
        const regexPattern = new RegExp(
            "^" +
                b.replace(".", "\.").replace(/\?/g, ".").replace(/\*/g, ".*") +
                "$",
        );
        return regexPattern.test(a);
    }
    return a == b || a.includes(b) || b.includes(a);
}

export function arrayToDict(arr: any[], key: string, value: string) {
    const dict: Dict = {};
    for (const elem of arr) {
        if (elem[key] && elem[value]) {
            dict[elem[key]] = elem[value];
        }
    }
    return dict;
}

/**
 * @info separates numbers eg. 3000000 -> 3,000,000
 * @param number
 * @param separator default is ,
 * @returns string with numbers separated. Doesn't separate values after the decimal point.
 */
export function separateNum(number: string | number, separator?: string) {
    let cursep = ",";
    if (separator) {
        cursep = separator;
    }
    let ans = `${number}`.replace(/\B(?=(\d{3})+(?!\d))/g, cursep);
    if (`${number}`.includes(".")) {
        const init = `${number}`.split(".")[0];
        const after = `${number}`.split(".")[1];
        ans = init.replace(/\B(?=(\d{3})+(?!\d))/g, cursep) + `.${after}`;
    }
    return ans;
}

export function pathToAllFolderLinks(str: string) {
    const split = str.split("/");
    if (split[0].length == 0) split.shift();
    if (split[split.length - 1].length == 0) split.pop();

    const links: string[][] = [];
    for (const sub of split) {
        let link = links.map((x) => x[0]).join("/") + "/" + sub;
        if (link.startsWith("//")) link = link.replace("/", "");
        if (!link.startsWith("/")) link = "/" + link;
        links.push([sub, link]);
    }
    return links;
}

export function formatBytes(bytes: number, decimals = 2, k = 1024) {
    if (!+bytes) return "0 Bytes";
    const dm = decimals < 0 ? 0 : decimals;
    let sizes = ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
    if (k == 1000) {
        sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    }
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function pagesToValues(
    current: number,
    count: number,
): (string | number)[] {
    if (count <= 5) {
        const temp = [];
        for (let i = 0; i < count; i++) {
            temp.push(i);
        }
        return fixPages(temp);
    } else if (current < 3) {
        const temp = [];
        for (let i = 0; i < count; i++) {
            if (i < 5 || i == count - 1) {
                temp.push(i);
                continue;
            } else {
                temp.push("...");
            }
        }
        return fixPages(temp);
    } else if (current > count - 4) {
        const temp = [];
        for (let i = 0; i < count; i++) {
            if (i == 0 || i >= count - 5) {
                temp.push(i);
                continue;
            } else {
                temp.push("...");
            }
        }
        return fixPages(temp);
    } else {
        const temp: (string | number)[] = [];
        for (let i = 0; i < count; i++) {
            if (i == 0 || i == count - 1) {
                temp.push(i);
                continue;
            } else if (i == current || i == current - 1 || i == current + 1) {
                temp.push(i);
                continue;
            } else {
                temp.push("...");
            }
        }
        return fixPages(temp);
    }
}

function fixPages(elems: (string | number)[]) {
    const values: (string | number)[] = [];
    let preval: any = "";
    for (const value of elems) {
        if (value == "..." && preval != "...") {
            values.push(value);
        } else if (!values.includes(value)) {
            values.push(value);
        }
        preval = value;
    }
    return values;
}

export type imageType =
    "big" | "medium" | "small" | "square" | "square_small" | "flag";

export function imageError(event: Event, type: imageType) {
    let newimage = "/img/";
    let [w, h] = [1920, 1080];
    switch (type) {
        case "big":
        case "medium":
        default:
            newimage += "404-long.png";
            break;
        // case "small":
        //     newimage += "404_small.jpg";
        //     break;
        case "square":
        case "square_small":
            newimage += "404-square.png";
            break;
        case "flag":
            newimage += "flags/__.png";
            break;
    }
    console.warn(
        'Could not load image "' +
            (event.target as HTMLImageElement).src +
            '"\nReplacing with \"' +
            newimage +
            '"',
    );
    const target = event.target as HTMLImageElement;
    target.setAttribute("data-src-old", target.src);
    target.src = newimage;

    // const target = (event.target as HTMLImageElement).style;
    // target.setProperty("--img-fallback", `url("${newimage}")`);
    // target.setProperty("max-width", w + "px");
    // target.setProperty("max-height", h + "px");
    // target.setProperty("width", "100%");
    // target.setProperty("height", "100%");

    // target.setProperty("display", "inline-block");
}

export function updateQuery(query: string) {
    try {
        let newurl = new URL(window.location.href);
        if (query && query.length > 0) {
            const newquery = formatQueryString(query);
            // newurl = updateParamNoEncode(newurl, "q", newquery);
            newurl.searchParams.set("q", newquery);
        } else {
            newurl.searchParams.delete("q");
        }
        if (newurl.toString() != window.location.href) {
            replaceState(newurl, {});
        }
    } catch (error) {
        console.log(error);
    }
}

export function getQuery() {
    try {
        const url = new URL(window.location.href);
        const query = url.searchParams.get("q") ?? "";
        return decodeURIComponent(query);
    } catch (err) {
        return "";
    }
}

export function updateParamNoEncode(url: URL, key: string, value: string) {
    const keys: Dict<string> = {};
    let isthere = false;
    for (const [k, v] of url.searchParams) {
        if (k == key) {
            keys[k] = value;
            isthere = true;
        } else {
            keys[k] = v;
        }
    }
    if (!isthere) {
        keys[key] = value;
    }
    url.search =
        "?" +
        Object.entries(keys)
            .map(([k, v]) => k + "=" + v)
            .join("&");
    return url;
}

export function formatQueryString(query: string) {
    // for whatever reason svelte just changes it back to a " " (or %20)
    return encodeURIComponent(query);
}

export function dictToSelectable(
    input: Dict<string>,
    disableSearch: string = "",
) {
    const temp: {
        value: string;
        label: string;
        disabled: boolean;
    }[] = [];
    for (const key in input) {
        let disabled = false;
        if (disableSearch && input[key].includes(disableSearch)) {
            disabled = true;
        }

        temp.push({
            value: key,
            label: input[key],
            disabled,
        });
    }
    return temp;
}

export function resetFocus() {
    (document.activeElement as HTMLElement).blur();
}

export function toClipboard(text: string) {
    navigator.clipboard.writeText(text);
}
