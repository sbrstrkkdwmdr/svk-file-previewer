/**
 * TODO
 * 
 * checklist parsing
 * 
 * bold, italics, blockquotes, strikethrough
 * 
 * ordered lists
 * 
 * full codeblocks
 * 
 * hyperlinks
 * 
 * image with alt text
 * 
 * footnotes
 * 
 * definitions
 * 
 * highlights
 * 
 * subscript and super script
 */

import { type Dict } from "$lib/data/types";

type mdBlocks =
    'blank' |
    'h1' | 'h2' | 'h3' |
    'table-row' | 'table-seperator' |
    'list-item' | 'list-item-ordered' | 'checklist-item' | 'checklist-item-checked' |
    'codeblock' |
    'blockquote' | 'quote' |
    'hr'
    ;

type mdLine = {
    type: mdBlocks,
    line: string,
};

/**
 * converts a markdown string into HTML strings
 * 
 * doesn't use DOM due to this being a backend script
 */
export class MarkDownRenderer {
    private input: string;
    private categorised: mdLine[];
    private elems: string[];
    private footnotes: Dict<boolean>;
    constructor(input: string) {
        this.input = input;
        this.categorised = [];
        this.elems = [];
        this.footnotes = {};
    }
    public render() {
        this.categorise();
        this.firstLevel();

        return this.secondlevel().join('\n');
    }

    private categorise() {
        const toArr = this.input.split('\n').join('\r').split('\r');
        let lastLineIsEmpty = false;
        // get what type of info each line is
        for (const line of toArr) {
            if (line.trim() == '' && !lastLineIsEmpty) {
                lastLineIsEmpty = true;
                continue;
            } else {
                lastLineIsEmpty = false;
            }
            /* categorised.push({
                type: 'blank',
                line: '<br>'
            }); */
            this.categorised.push({
                type: this.lineType(line),
                line
            });
        }
    }

    private lineType(line: string): mdBlocks {
        if (line.trim().startsWith('### ')) return 'h3';
        if (line.trim().startsWith('## ')) return 'h2';
        if (line.trim().startsWith('# ')) return 'h1';
        if (line.includes('---') && line.includes('|') && line?.split('|').length > 2) return 'table-seperator';
        if (line.includes('|') && line?.split('|').length > 2) return 'table-row';
        if (line.trim().startsWith('- [x]')) return 'checklist-item-checked';
        if (line.trim().startsWith('- [ ]')) return 'checklist-item';
        if (line.trim().startsWith('- ')) return 'list-item';
        if (this.isOrderElem(line.trim())) return 'list-item-ordered';
        if (line.trim().startsWith('```')) return 'codeblock';
        if (line.trim().startsWith('> ')) return 'blockquote';
        if (line.trim() == '---') return 'hr';
        return 'blank';
    }

    private firstLevel() {
        let curCodeBlock = '';
        let isCodeBlock = false;
        let cl = '';

        for (const line of this.categorised) {
            if (isCodeBlock && line.type != 'codeblock') {
                curCodeBlock += line.line + '\n';
            } else {
                switch (line.type) {
                    case 'codeblock':
                        if (isCodeBlock) {
                            this.elems.push(`<code class="mdElem codeblock ${cl}">` + this.parseBasicMD_specialCharacters(curCodeBlock) + '</code>');
                            curCodeBlock = '';
                        } else {
                            const temp = line.line.replace('```', '').trim();
                            cl = temp == ''
                                ? '' :
                                'language-' + temp;
                        }
                        isCodeBlock = !isCodeBlock;
                        break;
                    case "blank": default:
                        this.elems.push(this.directMatch(line.line, 'p', null));
                        break;
                    case "h1":
                        this.elems.push(this.directMatchTextLink(line.line, line.type, '#'));
                        break;
                    case "h2":
                        this.elems.push(this.directMatchTextLink(line.line, line.type, '##'));
                        break;
                    case "h3":
                        this.elems.push(this.directMatchTextLink(line.line, line.type, '###'));
                        break;
                    case "table-row":
                        this.elems.push(this.tableRow(line.line));
                        break;
                    case "table-seperator":
                        {
                            const h = this.elems.pop()!.replaceAll('td', 'th');
                            this.elems.push(h);
                        }
                        break;
                    case "list-item":
                    case "checklist-item":
                    case "checklist-item-checked":
                        this.elems.push(this.listItem(line.line, line.type == 'checklist-item' || line.type == 'checklist-item-checked', line.type == 'checklist-item-checked'));
                        break;
                    case 'list-item-ordered':
                        this.elems.push(this.listItemOrdered(line.line));
                        break;
                    case 'blockquote':
                        this.elems.push(this.blockquote(line.line));
                        break;
                    case 'hr':
                        this.elems.push('<hr>');
                        break;
                }
            }
        }
        this.elems.push('');
    }

    private secondlevel() {
        let isList = false;
        let isTable = false;
        let isOl = false;
        let isBlockquote = false;

        const output: string[] = [];
        for (let i = 0; i < this.elems.length; i++) {
            let elem = this.elems[i];
            if (isOl && !this.elems[i].startsWith('<order-li')) {
                output.push('</ol>');
                isOl = false;
            } else if (!isOl && this.elems[i].startsWith('<order-li') && this.isOrderLiElem(this.elems[i])) {
                output.push('<ol class="mdElem">');
                isOl = true;
                elem = this.elems[i].replace('order-', '');
            } else if (isOl) {
                elem = this.elems[i].replace('order-', '');
            }

            if (isList && !this.elems[i].startsWith('<li')) {
                output.push('</ul>');
                isList = false;
            } else if (!isList && this.elems[i].startsWith('<li')) {
                output.push('<ul class="mdElem">');
                isList = true;
            }

            if (isTable && !this.elems[i].startsWith('<tr')) {
                output.push('</table>');
                isTable = false;
            } else if (!isTable && this.elems[i].startsWith('<tr')) {
                output.push('<table class="mdElem">');
                isTable = true;
            }

            if (isBlockquote && !this.elems[i].startsWith('<blockquote')) {
                output.push('</blockquote>');
                isBlockquote = false;
            } else if (!isBlockquote && this.elems[i].startsWith('<blockquote')) {
                output.push('<blockquote class="mdElem">');
                isBlockquote = true;
                elem = this.elems[i]
                    .replaceAll('<blockquote class="mdElem">', '')
                    .replaceAll('</blockquote>', '');
            } else if (isBlockquote) {
                elem = '<br>' + this.elems[i]
                    .replaceAll('<blockquote class="mdElem">', '')
                    .replaceAll('</blockquote>', '');
            }
            output.push(elem);
        }
        return output;
    }

    private isOrderElem(str: string) {
        if (!str.includes('.')) return false;
        const temp = str.split('.');
        return !isNaN(+temp[0]);
    }
    private isOrderLiElem(str: string) {
        return str.startsWith('<order-li');
    }
    /**
     * inside-block parsing
     */
    private parseBasicMD(markdownText: string) {
        // lt, gt etc.
        markdownText = this.parseBasicMD_specialCharacters(markdownText);

        markdownText = this.replacePattern(markdownText, /^(`{3}.*[\n\r][^]*?^`{3})/gm, 'code');
        markdownText = this.replacePattern(markdownText, /(?<!`)\`([^`\n]+?)\`(?!`)/g, 'code');

        // links
        markdownText = markdownText.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_, text, url) => {
            return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="highlightLink">${text}</a>`;
        });
        markdownText = markdownText.replace(/\[([^\]]+)\]\((mailto:[^\s)]+)\)/g, (_, text, url) => {
            return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="highlightLink">${text}</a>`;
        });

        markdownText = markdownText.replace(/\[([^\]]+)\]\((.\/[^\s)]+)\)/g, (_, text, url) => {
            return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="highlightLink">${text}</a>`;
        });
        markdownText = markdownText.replace(/\[([^\]]+)\]\((\#[^\s)]+)\)/g, (_, text, url) => {
            return `<a href="${url}" class="highlightLink">${text}</a>`;
        });

        // img alt text
        markdownText = markdownText.replace(/!\[([^\]]*?)\]\((.*?)\)/g, (_, altText, url) => {
            return `<img src="${url}" alt="${altText}">`;
        });

        // footnotes
        markdownText = markdownText.replace(/\[\^(.*?)\]/g, (_, text) => {
            return this.parseFootnote(text);
        });

        return markdownText;

        // TODO 
        // links with funny syntax eg. website.com/long_page_name doesn't parse properly

        // bold

        markdownText = this.replacePattern(markdownText,
            /\*\*(.*?)\*\*/g,
            'strong');
        // italics
        markdownText = this.replacePattern(markdownText,
            /\*(.*?)\*/g,
            'em');
        markdownText = this.replacePattern(markdownText,
            /\_(.*?)\_/g,
            'em');
        // strikethrough
        markdownText = this.replacePattern(markdownText,
            /~~(.*?)~~/g,
            's');
        // highlight
        markdownText = this.replacePattern(markdownText,
            /==(.*?)==/g,
            'mark');
        // superscript
        markdownText = this.replacePattern(markdownText,
            /\^(.*?)\^/g,
            'sup');
        // subscript
        markdownText = this.replacePattern(markdownText,
            /~(.*?)~/g,
            'sub');

        return markdownText;
    }
    private parseBasicMD_specialCharacters(str: string) {
        return str.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }
    private replacePattern(str: string, pattern: RegExp, block: string) {
        return str.replace(pattern, (_, text) => {
            return `<${block} class="mdElem">${text}</${block}>`;
        });
    }

    private directMatch(str: string, type: string, marker: string | null) {
        return `<${type} class="mdElem">${this.parseBasicMD(
            marker ? str.replace(marker, '') : str
        )}</${type}>`;
    }

    private directMatchTextLink(str: string, type: string, marker: string) {
        let use = str.replace(marker, '').trim();
        return `<${type} class="mdElem" id="${use.replaceAll(' ', '-')}">${this.parseBasicMD(use)}</${type}>`;
    }

    private tableRow(str: string) {
        const arr = str.split('|');
        let line = '<tr class="mdElem">';
        for (const cell of arr) {
            if (cell == '') continue;
            line += `<td class="mdElem">${this.parseBasicMD(cell)}</td>`;
        }
        line += '</tr>';
        return line;
    }

    private listItem(str: string, isCheck: boolean = false, isChecked: boolean = false) {
        let output = '<li class="mdElem';
        if (isCheck) {
            output += ' checkbox">';
            if (isChecked) {
                const temp = str.split('- [x]');
                temp.shift();
                output +=
                    `<img class="checkmark" src="/img/icons/checked.png">` +
                    this.parseBasicMD(temp.join('- [x]').trim());
            } else {
                const temp = str.split('- [ ]');
                temp.shift();
                output +=
                    `<img class="checkmark" src="/img/icons/unchecked.png">` +
                    this.parseBasicMD(temp.join('- [ ]').trim());
            }
        } else {
            const temp = str.split('-');
            temp.shift();
            output += '">' + this.parseBasicMD(temp.join('-').trim());
        }
        output += '</li>';
        return output;
    }

    private listItemOrdered(str: string) {
        const temp = str.split('.');
        temp.shift();
        let output = '<order-li class="mdElem">' + this.parseBasicMD(temp.join('-').trim()) + '</li>';
        return output;
    }

    private blockquote(str: string) {
        return this.directMatch(str, 'blockquote', '> ');
    }
    private parseFootnote(id: string) {
        if (this.footnotes.hasOwnProperty(id)) {
            this.footnotes[id] = true;
            return `<sup><span class="mdElem footnote" id="footnote-${id}">[${id}]</span></sup>`;
        } else {
            this.footnotes[id] = false;
            return `<sup><a class="highlightLink" href="#footnote-${id}">[${id}]</a></sup>`;
        }
    }
}