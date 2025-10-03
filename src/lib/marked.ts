import { lexer, marked, type MarkedExtension, type TokenizerObject } from "marked";
import markedAlert from 'marked-alert';
import markedFootnote from 'marked-footnote';

export async function markdownParse(text: string) {
    marked.use(markedFootnote());
    marked.use(markedAlert());
    marked.use({ extensions: [subsup, highlight] });
    marked.options({
        async: true
    });
    return await marked(text);
}

// use async ver or mini md parser func instead
export function markdownParseSync(text: string) {
    marked.use(markedFootnote());
    marked.use(markedAlert());
    marked.use({ extensions: [subsup, highlight] });
    marked.options({
        async: false
    });
    return marked(text);
}

// use marked when possible
export function miniMdParser(markdownText: string) {
    markdownText = markdownText.replaceAll('\n', '<br>');
    markdownText = markdownText.replace(/(```|~~~)(\w+)?\n([\s\S]*?)(\1)/g, (_, fence, lang, code) => {
        const escapedCode = code.trim()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        return `<code>${escapedCode}</code>`;
    });

    markdownText = markdownText.replace(/(?<!`)\`([^`\n]+?)\`(?!`)/g, (_, code) => {
        const escapedInline = code
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
        return `<code>${escapedInline}</code>`;
    });

    // // https:
    // markdownText = markdownText.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_, text, url) => {
    //     return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="highlightLink">${text}</a>`;
    // });
    // // mailto:
    // markdownText = markdownText.replace(/\[([^\]]+)\]\((mailto:[^\s)]+)\)/g, (_, text, url) => {
    //     return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="highlightLink">${text}</a>`;
    // });

    // // "/"
    // markdownText = markdownText.replace(/\[([^\]]+)\]\((\/[^\s)]+)\)/g, (_, text, url) => {
    //     return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="highlightLink">${text}</a>`;
    // });

        // [a](b)
    markdownText = markdownText.replace(/\[([^\]]+)\]\(([^\s)]+)\)/g, (_, text, url) => {
        return `<a href="${url}" rel="noopener noreferrer" class="highlightLink">${text}</a>`;
    });

    return markdownText;
}

// https://github.com/dbolack-ab/marked-subsuper-text
const subsup = {
    name: 'subSuperText',
    level: 'inline',
    start(src: string) { return src.match(/\^/m)?.index; },  // Hint to Marked.js to stop and check for a match
    tokenizer(src: string, tokens: any) {
        const superRegex = /^\^(?!\s)(?=([^\n\^]*[^\s\^]))\1\^/m;
        const subRegex = /^\~(?!\s)(?=([^\n\~]*[^\s\~]))\1\~/m;
        let isSuper = false;
        let match = subRegex.exec(src);
        if (!match) {
            match = superRegex.exec(src);
            if (match)
                isSuper = true;
        }
        if (match?.length) {
            return {
                type: 'subSuperText', // Should match "name" above
                raw: match[0],          // Text to consume from the source
                tag: isSuper ? 'sup' : 'sub',
                //@ts-expect-error lexer doesn't exist
                tokens: this.lexer.inlineTokens(match[1])
            };
        }
    },
    renderer(token: any) {
        //@ts-expect-error parser doesn't exist
        return `<${token.tag}>${this.parser.parseInline(token.tokens)}</${token.tag}>`;
    }
};

const highlight = {
    name: 'highlightText',
    level: 'inline',
    start(src: string) { return src.match(/\=/m)?.index; },  // Hint to Marked.js to stop and check for a match
    tokenizer(src: string, tokens: any) {
        const highlightRegex = /^\=\=(?!\s)(?=([^\n\=]*[^\s\=]))\1\=\=/m;
        let match = highlightRegex.exec(src);
        if (match?.length) {
            return {
                type: 'highlightText', // Should match "name" above
                raw: match[0],          // Text to consume from the source
                tag: 'mark',
                //@ts-expect-error lexer doesn't exist
                tokens: this.lexer.inlineTokens(match[1])
            };
        }
    },
    renderer(token: any) {
        //@ts-expect-error parser doesn't exist
        return `<${token.tag}>${this.parser.parseInline(token.tokens)}</${token.tag}>`;
    }
};