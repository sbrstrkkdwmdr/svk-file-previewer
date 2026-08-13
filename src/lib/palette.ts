import type { Dict } from "$lib/data/types";
import { writable } from "svelte/store";

export type colourPalette =
    | "dark_default"
    | "light_default"
    | "light_alt"
    | "matrix"
    | "dark_alt"
    | "dark_hc";

export const paletteValue = writable("none" as colourPalette);
export function syncPalette() {
    if (window?.localStorage) {
        const temp = localStorage?.getItem("colourMode");
        if (temp) {
            console.log("Fetched theme from localStorage: ", temp);
            paletteValue.set(temp as colourPalette);
            return;
        }
    }
    console.log("Defaulting theme to prefers-color-scheme");
    if (!window.matchMedia("(prefers-color-scheme: dark)").matches) {
        paletteValue.set("light_default");
        return;
    } else {
        paletteValue.set("dark_default");
        return;
    }
}
paletteValue.subscribe((value) => {
    //@ts-expect-error none doesn't overlap with type colourPalette
    if (value == "none") return;
    try {
        localStorage?.setItem("colourMode", value);
    } catch (err) {
        console.log("Could not save theme to localStorage");
        console.log(err);
    }
});

function getColourMode(): colourPalette {
    if (window?.localStorage) {
        const temp = localStorage?.getItem("colourMode");
        if (temp) {
            return temp as colourPalette;
        } else if (!window.matchMedia("(prefers-color-scheme: dark)").matches) {
            return "light_default";
        }
    }
    return "dark_default";
}

function setColourMode(value: colourPalette) {
    try {
        localStorage?.setItem("colourMode", value);
    } catch (err) {
        console.log("Could not save palette  to local storage");
        console.log(err);
    }
}

export const palettes: Dict<[string, string], colourPalette> = {
    dark_default: ["Dark", "moon"],
    light_default: ["Light", "sun"],
    dark_alt: ["Dark (Alt)", "moon"],
    light_alt: ["Light (Old ver.)", "sun"],
    matrix: ["Matrix", "moon"],
    dark_hc: ["High Contrast dark", "moon"],
};

export const paletteName = (palette: colourPalette) => palettes[palette][0];

/**
 * update theme of body element
 */
function updateBodyClass(newtheme: string) {
    const body = document.getElementsByTagName("body")[0];
    if (!body) return;
    let bClass = body.className;
    const split = bClass.split(" ");
    let themed = false;
    for (let i = 0; i < split.length; i++) {
        if (split[i].startsWith("theme-")) {
            split[i] = "theme-" + newtheme;
            themed = true;
        }
    }
    if (!themed) {
        split.push("theme-" + newtheme);
    }
    body.className = split.join(" ");
}
