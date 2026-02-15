import { subdomainoffset } from "./data/std";
import type { Dict } from "./data/types";

export const str = "hi";

// https://stackoverflow.com/a/7225450
export function camelCaseToWords(s: string) {
    const result = s.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
}

export function toCapital(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// https://stackoverflow.com/a/784611
export function fixHtmlChars(str: string) {
    return str.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}

function markdownToHtml(markdownText: string): string {
    markdownText = markdownText.replaceAll('\n', '<br>');
    markdownText = markdownText.replace(/(```|~~~)(\w+)?\n([\s\S]*?)(\1)/g, (_, fence, lang, code) => {
        const escapedCode = code.trim()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        return `<span class="code-block">${escapedCode}</span>`;
    });

    markdownText = markdownText.replace(/(?<!`)\`([^`\n]+?)\`(?!`)/g, (_, code) => {
        const escapedInline = code
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        return `<span class="inline-code">${escapedInline}</span>`;
    });

    markdownText = markdownText.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_, text, url) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="highlightLink">${text}</a>`;
    });
    markdownText = markdownText.replace(/\[([^\]]+)\]\((mailto:[^\s)]+)\)/g, (_, text, url) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="highlightLink">${text}</a>`;
    });
    markdownText = markdownText.replace(/\[([^\]]+)\]\((\/[^\s)]+)\)/g, (_, text, url) => {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="highlightLink">${text}</a>`;
    });

    return markdownText;
}

export class UrlParser {
    private urlObject: URL;
    private subdomainOffset!: number;
    private canHaveSubdomains!: boolean;

    public get href() { return this.urlObject.href; };
    public set href(v: string) {
        this.urlObject = new URL(v);
        this.parse(v, subdomainoffset);
    }

    public get protocol() { return this.urlObject.protocol; }
    public get subdomains() { return this._subdomains; };
    public set subdomains(v: string[]) { this._subdomains = v; };
    public get primaryDomain() {
        let temp = this.urlObject.hostname;
        for (const sub of this._subdomains) {
            temp = temp.replace(sub + '.', '');
        }
        return temp;
    }
    private _subdomains: string[] = [];
    public get path() { return this.urlObject.pathname; }
    public get hash() { return this.urlObject.hash; }
    public get params() { return this.urlObject.searchParams; }
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
        for (const w of sbd.split('.')) {
            if (!isNaN(+w)) temp.push(+w);
        }
        return temp.join('.') != sbd;
    }
    private parse(url: string, subdomainOffset = subdomainoffset) {
        if (url.includes('localhost')) this.subdomainOffset = 1;
        else this.subdomainOffset = subdomainOffset;
        this.canHaveSubdomains = this.isIp();
        this.setSubdomains();
    }
    private setSubdomains() {
        if (!this.canHaveSubdomains) return;
        const splitDom = this.urlObject.hostname.split('.');
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
        let url = this.protocol + '//';
        if (subdomains.length > 0) url += subdomains.join('.') + '.';
        url += host;
        if (port && port.length > 0) url += ':' + port;
        if (path && path.length > 0) url += path;
        if (params && params.length > 0) url += params;
        if (hash && hash.length > 0) url += hash;
        return url;
    }
}

export class OldUrlParser {
    private url: string;
    private subdomainOffset: number;
    public protocol: string = '';
    public port: number = 0;
    public subdomains: string[] = [];
    public domain: string = '';
    public get path(): string {
        return this.sp ?? '/';
    }
    public set path(v: string) {
        if (v.startsWith('/')) this.sp = v;
        else this.sp = '/' + v;
    }
    private sp?: string;
    public locator: string = '';
    public params: Dict<string> = {};
    public get paramString() {
        let str = '';
        const params = Object.entries(this.params);
        if (params.length > 0) {
            str += `?${params[0][0]}=${params[0][1]}`;
            params.shift();
            for (const e of params) {
                str += `?${e[0]}=${e[1]}`;
            }
        }
        return str;
    }
    public get hash() {
        return this.locator;
    }
    public get origin() {
        return this.protocol + '://' + this.domain;
    }
    public get href() {
        let surl = this.protocol + '://';
        if (this.subdomains) surl += this.subdomains.join('.') + '.';
        surl += this.domain;
        if (this.port) surl += ':' + this.port;
        if (this.path) {
            surl += this.path;
        }
        if (this.locator) surl += '#' + this.locator;
        surl += this.paramString;
        return surl;
    }
    /**
     * 
     * @param subdomainOffset if accessing via localhost set this to 1. This is the number of "."s in the domain + 1. DO NOT INCLUDE SUBDOMAINS IN THIS NUMBER
     * 
     * localhost -> 1
     * 
     * api.localhost -> 1 (api is a subdomain)
     * 
     * transportnsw.info -> 2 (info is TLD)
     * 
     * user.github.io -> 2 (io is TLD)
     * 
     * www.somewebsite.me -> 2 (www is a subdomain, me is TLD)
     * 
     * accc.gov.au -> 3 (gov.au is TLD)
     * 
     * transport.vic.gov.au -> 4 (vic.gov.au is TLD)
     */
    constructor(url: string, subdomainOffset: number = subdomainoffset) {
        this.url = url;
        if (url.includes('localhost')) subdomainOffset = 1;
        this.subdomainOffset = subdomainOffset;
        this.parse();
        this.url = url;
    }
    private parse() {
        try {
            this.parseProtocol();
            this.parsePort();
            this.parseDomain();
            this.parsePath();
        } catch (err) {
            console.log(err);
        }
    }
    private parseProtocol() {
        if (this.url.includes('://')) {
            this.protocol = this.url.split('://')[0];
            this.url = this.url.split('://')[1];
        }
    }
    private parseDomain() {
        // {subdomains?}.{domain.TLD}{/path?}{#hash?}
        let temp = this.url;
        if (this.url.includes('/')) {
            const www = this.url.split('/');
            temp = www.shift()!;
            this.url = '/' + www.join('/');
        }
        // {subdomains.domain.TLD}
        if (temp.includes('.')) {
            const split: string[] = temp.split('.');
            let domain: string[] = [];
            for (let i = 0; i < this.subdomainOffset && i < split.length; i++) {
                domain.push(split.pop() as string);
            }
            this.subdomains = split ?? [];
            this.domain = domain.join('.');
        } else {
            this.domain = temp;
        }

    }
    private parsePort() {
        if (this.url.includes(':')) {
            const temp = this.url.split(':')[1];
            this.port = parseInt(this.url.includes('/') ?
                temp.split('/')[0] : temp);
            this.url = this.url.replace(':' + this.port, '');
        }
    }
    //type error cannot read properties of undefined reading 'includes'
    // weird thing is it still works anyways?? tf
    private parsePath() {
        if (this.url == '' || !this.url) {
            this.path = '/';
            return;
        }
        if (this.url?.includes('#')) {
            this.path = this.url.split('#')[0];
            this.locator = this.url.split('#')[1];
        } else if (this.url?.includes('?')) {
            this.path = this.url.split('?')[0];
            this.parseParams(this.url.split('?')[1]);
        }
        else {
            this.path = this.url;
        }
    }
    private parseParams(str: string) {
        let items: string[] = [str];
        if (str.includes('&')) items = str.split('&');
        for (const str of items) {
            const key = str.split('=')[0];
            const val = str.split('=')[1];
            this.params[key] = val;
        }
    }
}

// see https://github.com/sbrstrkkdwmdr/ssob/blob/main/src/commands/command.ts
export function getLink(pattern: string, input: string) {
    const paramNames: string[] = [];
    let rawRegex = pattern.replace(/{(\w+)}/g, (_, name) => {
        paramNames.push(name);
        return '<<<CAPTURE>>>';
    });

    rawRegex = rawRegex.replace(/([.+?^$()|[\]\\])/g, '\\$1');

    const regexPattern = rawRegex.replace(/<<<CAPTURE>>>/g, '([^/#?]+)');

    const regex = new RegExp('^' + regexPattern + '$');

    const match = input.match(regex);
    if (match) {
        const result = paramNames.map((name, index) => ({
            [name]: match[index + 1],
        }));

        return kvToDict(result);
    }

    return null;
}
function kvToDict(array: any[]) {
    const dictionary: Dict = {};
    for (const elem of array) {
        const key = Object.keys(elem)[0];
        dictionary[key] = elem[key];
    }
    return dictionary;
}

export function secondsToTime(seconds: number, allowDays?: boolean) {
    const days = Math.floor(seconds / 60 / 60 / 24).toString();
    const hours =
        allowDays == true ?
            (seconds / 60 / 60 % 24 < 10 ? '0' + Math.floor(seconds / 60 / 60 % 24) : Math.floor(seconds / 60 / 60 % 24)).toString()
            : (seconds / 60 / 60 < 10 ? '0' + Math.floor(seconds / 60 / 60) : Math.floor(seconds / 60 / 60)).toString();
    const minutes = seconds / 60 % 60 < 10 ? '0' + Math.floor(seconds / 60 % 60) : Math.floor(seconds / 60 % 60);
    const secs = seconds % 60 < 10 ? '0' + Math.floor(seconds % 60) : Math.floor(seconds % 60);
    let str;
    if (allowDays == true) {
        str =
            parseInt(days) > 0 ?
                `${days}:${hours}:${minutes}:${secs}` :
                parseInt(hours) > 0 ?
                    `${hours}:${minutes}:${secs}` :
                    `${minutes}:${secs}`;
    } else {
        str = parseInt(hours) > 0 ?
            `${hours}:${minutes}:${secs}` :
            `${minutes}:${secs}`;
    }
    return str;
}

/**
 * /directory/filename.png -> filename
 * 
 * file.test.ts -> file.test
 */
export function pathToFilename(str: string) {
    const file =
        str.includes('/') ?
            str.split('/').pop()! : str;
    if (file.includes('.')) {
        const wip = file.split('.');
        wip.pop();
        return wip.join('.');
    }
    return file;
}

export function listItems(list: string[]) {
    let string = '';
    if (list.length > 1) {

        for (let i = 0; i < list.length - 2; i++) {
            string += list[i] + ', ';
        }
        string += list[list.length - 2] + ' and ' + list[list.length - 1];
    } else {
        return list[0];
    }
    return string;
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

export function fisherYatesShuffle(arr: any[]) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export function stringMatches(str1: string, str2: string) {
    const a = str1.toLowerCase();
    const b = str2.toLowerCase();
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

// https://stackoverflow.com/a/30521308
export function pascalCamelToSnake(str: string) {
    const fixed =
        // str.replace(/(?:^|\.?)([A-Z])/g, function (x: string, y: string) { return "_" + y.toLowerCase(); }).replace(/^_/, "");
        str.replace(/\.?([A-Z])/g, function (x: string, y: string) { return "_" + y.toLowerCase(); }).replace(/^_/, "").replaceAll(' ', '_').replaceAll('__', '_');
    return fixed;
}

/**
 * eg 1,000 -> 1k
 * 1,000,000 -> 1m
 * 1,111,111 -> 1.111m
 * 111,111 -> 111.1k
 */
export function numberShorthand(input: number) {
    let value = +scientificNotation(input, 3);
    let output = input + '';
    switch (true) {
        case value >= 1e9:
            output = value / 1e9 + 'B';
            break;
        case value >= 1e8:
        case value >= 1e7:
        case value >= 1e6:
            output = value / 1e6 + 'M';
            break;
        case value >= 1e5:
        case value >= 1e4:
        case value >= 1e3:
            output = value / 1e3 + 'K';
            break;
    }
    return output;
}

export function scientificNotation(input: number, significantFigures: number) {
    let tNum: string;
    const numString = input.toString().replace(/[-.]/g, ''); // Remove "-" and "."
    const eIndex = numString.indexOf('e');
    const numLength = eIndex !== -1 ? eIndex : numString.length;

    if (numLength <= significantFigures) {
        tNum = `${input}`;
    } else if (input !== 0) {
        let exponent = 0;
        let i = 0;
        while (Math.abs(input) < 1 || Math.abs(input) >= 10) {
            i++;
            if (Math.abs(input) < 1) {
                input *= 10;
                exponent--;
            } else if (Math.abs(input) >= 10) {
                input /= 10;
                exponent++;
            }
        }
        let mantissa = input.toFixed(significantFigures - 1);
        // Code to ensure the number has the correct number of significant figures
        const xFig = significantFigures + (mantissa.match(/[-.]/g) || []).length;
        mantissa = mantissa.slice(0, xFig);
        mantissa = mantissa.slice(0, xFig);
        if (exponent !== 0) {
            tNum = `${mantissa}e${exponent}`;
        } else {
            tNum = mantissa;
        }
    } else {
        tNum = '0';
    }


    if (tNum.endsWith('.')) {
        tNum = tNum.replace('.', '');
    }

    return tNum;
}

/**
 * @info separates numbers eg. 3000000 -> 3,000,000
 * @param number 
 * @param separator default is ,
 * @returns string with numbers separated. Doesn't separate values after the decimal point.
 */
export function separateNum(number: string | number, separator?: string) {
    let cursep = ',';
    if (separator) {
        cursep = separator;
    }
    let ans = `${number}`.replace(/\B(?=(\d{3})+(?!\d))/g, cursep);
    if (`${number}`.includes('.')) {
        const init = `${number}`.split('.')[0];
        const after = `${number}`.split('.')[1];
        ans = init.replace(/\B(?=(\d{3})+(?!\d))/g, cursep) + `.${after}`;
    }
    return ans;
}

// export function pathToDownload(path: string, preview: boolean = true) {
//     let url = '/api/download';
//     const split = path.split('/');
//     const filename = split.pop()!;
//     url += '?name=' + filename;
//     url += '&location=' + split.join('/') + '/';
//     if (preview) url += '&preview=true';
//     return url;
// }

export type colourPalette = 'light_default' | 'dark_default';

export function getColourMode(): colourPalette {
    const temp = localStorage?.getItem("colourMode");
    if (temp) {
        return temp as colourPalette;
    } else if (!window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "light_default";
    }
    return "dark_default";
}

export function setColourMode(value: colourPalette) {
    try {
        localStorage?.setItem("colourMode", value);
    } catch (err) {
        console.log(err);
    }
}

export function pathFinalName(path: string) {
    const temp = path.split('/');
    return temp.pop() ?? '';
}