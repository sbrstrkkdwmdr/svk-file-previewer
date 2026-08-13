import type { pathableItem } from "./data/files";
import { stringMatches } from "./tools";

export function fileSearch(parent: pathableItem<"folder">, match: string) {
    const temp = { ...parent };
    temp.children = [];
    for (const file of parent.children) {
        if (file.type == "folder") {
            const nf = fileSearch(file as pathableItem<"folder">, match);
            if (nf.children.length > 0) {
                temp.children.push(nf);
            }
        } else if (
            stringMatches(file.name, match) ||
            (stringMatches(file.directory, match) && file.directory != "")
        ) {
            temp.children.push(file);
        }
    }
    return temp;
}
