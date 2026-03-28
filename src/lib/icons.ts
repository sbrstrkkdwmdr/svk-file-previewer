import type { Dict } from "./data/types";

export type icon = {
    code: string;
    colour?: string;
};

export const utils = {
    // pointers
    chevronDown: "ed23",
    chevronUp: "ed26",
    chevronLeft: "ed24",
    chevronRight: "ed25",

    chevronDoubleDown: "e989",
    chevronDoubleUp: "e98c",
    chevronDoubleLeft: "e98a",
    chevronDoubleRight: "e98b",

    arrowDown: "e981",
    arrowUp: "e986",
    arrowLeft: "e984",
    arrowRight: "e985",
    arrowDownLeft: "e982",
    arrowDownRight: "e983",
    arrowUpLeft: "e987",
    arrowUpRight: "e988",

    // common actions
    check: "ed20",
    checkCircle: "ed21",
    x: "edca",
    cross: "edca", // alias
    xCircle: "edcb",
    link: "ed65",
    search: "e918",
    copy: "edfb",
    copy_feather: "ed36",
    paste: "edfc",
    external: "ed42",
    leave: "eee3",
    menu: "ed71",
    minimise: "ed76",
    maximise: "ed6e",
    minimiseArrow: "ed77",
    maximiseArrow: "ed6f",

    // content
    hide: "ed44",
    show: "ed43",
    eye: "ed43", // alt
    info: "e96a",
    at: "e96b",
    briefcase: "e96c",
    edit: "e92e",
    edit_penonly: "ed41",
    edit_under: "e91a",
    code: "ed2f",
    lock: "e933",
    unlock: "e939",
    location: "e934",
    mouse: "ed7e",

    // media
    play: "e99d",
    pause: "e9ab",
    rewind: "e9ac",
    fastForward: "e9aa",
    skipBack: "e99e",
    skipForward: "e99f",
    shuffle: "e9a9",
    repeat: "e98d",

    // settings
    calendar: "e980",
    settings: "e936",
    crop: "e99b",
    volumeNone: "e9a2",
    volumeMid: "e9a3",
    volumeFull: "e9a4",
    volumeMute: "e9a5",
    clock: "e993",
    filter: "ed4c",
    tag: "edb0",

    // internet
    download: "e919",
    upload: "e93a",
    wifi: "e91f",
    wifiNone: "e920",
    person: "e976",
    user: "e976",
    people: "e977",
    users: "e977",

    // shapes
    circle: "e992",
    triangle: "e9a1",
    square: "e9a0",
    pentagon: "xxx",
    hexagon: "e99c",
    heptagon: "xxx",
    octagon: "e935",

    cube: "e991",
    box: "e991",

    sun: "e96f",
    moon: "e96e",
    star: "e97f",
    heart: "e97e",
    globe: "e932",

    // content
    document: "e924",
    text: "e938",
    music: "e91d",
    audio: "e91b",
    image: "e91c",
    tv: "e91e",
    monitor: "ed7b",
    video: "edc6",
    videoOff: "edc7",
    trash: "edb8",
    trashAlt: "e937",
    pen: "e9b0",

    // file types
    fileGeneric: "e924",
    fileArchive: "e92b",
    fileText: "edf6",
    fileImage: "edf7",
    fileAudio: "edf8",
    fileVideo: "edf9",
    folder: "ed4e",
    folderOpen: "edff",

    // osu
    modeOsu: "e97a",
    modeTaiko: "e97b",
    modeFruits: "e978",
    modeMania: "e979",

    layout: "ed63",
    grid: "ed5a",
    list: "ed68",

    // power
    power: "ed94",
    battery: "e98f",
    batteryCharging: "e990",
    zap: "e9a7",
    zapOff: "e9a8",

    // tech
    database: "ed3b",
    terminal: "edb2",
    cpu: "ed38",
    palette: "xxx",
};

export const sites = {
    behance: ["ef78", ],
    bilibili: ["e902", ],
    bluesky: ["e904", ],
    discord: ["efba", "#5865F2"],
    "discord-clear": ["efba", ],
    dropbox: ["ea30", "#0061FF"],
    email: ["ed6c", ],
    facebook: ["ea58", ],
    github: ["ea82", "purple"],
    "github-clear": ["ea82", ],
    instagram: ["eae0", ],
    linkedin: ["eb25", ],
    mediafire: ["eb47", "#0077FF"],
    mega: ["eb4b", "#D9272E"],
    niconicodouga: ["e903", ],
    osu: ["e905", "#FF66AA"],
    pronouns: ["e906", "#C71585"],
    reddit: ["e92a", ],
    steam: ["ec56", ],
    tiktok: ["ec85", ],
    tumblr: ["ec97", ],
    twitch: ["ec9a", ],
    twitter: ["ef65", ],
    vk: ["ef67", ],
    yt: ["ecf4", "red"],
    "yt-clear": ["ecf4",  /* 'red' */],

    // tech
    csharp: ["ea07", "#239120"],
    css: ["ea08", "#1572b6"],
    go: ["ea8e", "#4ec6e4"],
    godot: ["ea8f", "#478cbf"],
    html: ["eac9", "#e34f26"],
    java: ["eaf0", "#007396"],
    js: ["eaf1", "#f7df1e"],
    lua: ["eb2f", "#000080"],
    mysql: ["eb72", "#4479a1"],
    nodejs: ["eb81", "#339933"],
    php: ["ebb0", "#474A8A"],
    py: ["ebd6", "#3776AB"],
    react: ["ebea", "#61DAFB"],
    rs: ["ec05", "#D34516"],
    svelte: ["ec6a", "#FF3E00"],
    ts: ["ec9d", "#3178C6"],

    filebash: ["e901", "#4EAA25"],
    filec: ["e9d0", "#A9BACD"],
    filecmd: ["ecd3", "#0078D6"],
    filecpp: ["ea01", "#00599C"],
    filecs: ["ea07", "#239120"],
    filecss: ["ea08", "#1572b6"],
    filedart: ["ea0d", "#0175C2"],
    filegd: ["ea8f", "#478cbf"],
    filego: ["ea8e", "#4ec6e4"],
    filehaskell: ["eab9", "#5D4F85"],
    filehtml: ["eac9", "#e34f26"],
    filejava: ["eaf0", "#007396"],
    filejs: ["eaf1", "#f7df1e"],
    filejson: ["eafd", "#A9BACD"],
    filejupyter: ["eafe", "#F37626"],
    filekotlin: ["eb11", "#7F52FF"],
    filelatex: ["eb19", "#008080"],
    filelua: ["eb2f", "#000080"],
    filephp: ["ebb0", "#474A8A"],
    filepowershell: ["ebc8", "#012456"], // colour of bg default ps
    filepy: ["ebd6", "#3776AB"],
    filer: ["ebe5", "#276DC3"],
    filereact: ["ebea", "#61DAFB"],
    filereactjsx: ["ebea", "#61DAFB"],
    filereacttsx: ["ebea", "#61DAFB"],
    filers: ["ec05", "#D34516"],
    fileruby: ["ec02", "#CC342D"],
    filesass: ["ec0d", "#CC6699"],
    filesvelte: ["ec6a", "#FF3E00"],
    fileswift: ["ec6f", "#F05138"],
    filets: ["ec9d", "#3178C6"],
    filexml: ["e900", "#005FAD"],
};

function toClass(
    name: string,
    code: string,
    colour?: string,
    hoverclr?: string,
) {
    let txt = `
.icon-${name}::before {
    content: "\\${code}";
    ${colour ? "color:" + colour + ";" : ""}
}
`;
    if (hoverclr) {
        txt += `
.icon-${name}:hover::before {
    color: ${hoverclr};
}
`;
    }
    return txt;
}

export function getIcons(): string {
    let txt = `
@font-face {
    font-family: 'icomoon';
    src: url('app/styles/fonts/icomoon/icomoon.eot?g0f7zq');
    src: url('app/styles/fonts/icomoon/icomoon.eot?g0f7zq#iefix') format('embedded-opentype'),
        url('app/styles/fonts/icomoon/icomoon.ttf?g0f7zq') format('truetype'),
        url('app/styles/fonts/icomoon/icomoon.woff?g0f7zq') format('woff'),
        url('app/styles/fonts/icomoon/icomoon.svg?g0f7zq#icomoon') format('svg');
    font-weight: normal;
    font-style: normal;
    font-display: block;
}

[class^="icon-"],
[class*=" icon-"],
[class^="icon-"],
[class*=" icon-"] {
    /* use !important to prevent issues with browser extensions that change fonts */
    font-family: 'icomoon' !important;
    speak: never;
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    text-transform: none;
    line-height: 1;

    /* Better Font Rendering =========== */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.icon-drivegoogle.path1:before {
    content: "\\edc1";
    color: #3777e3;
}

.icon-drivegoogle.path2:before {
    content: "\\edc2";
    color: #ffcf63;
    margin-left: -1em;
}

.icon-drivegoogle.path3:before {
    content: "\\edc3";
    color: #11a861;
    margin-left: -1em;
}
`;
    for (const key in utils) {
        txt += toClass(key, utils[key as keyof typeof utils]);
    }
    for (const key in sites) {
        const rr = sites[key as keyof typeof sites];
        const code = rr[0];
        let clr = rr[1];
        if (!clr) {
            clr = "var(--icon-default-highlight)";
        }
        txt += toClass(key, code, clr, clr);
    }

    // defined last so that it can override
    txt += `.iconDefClr::before {
    /* color: basic; */
    color: var(--text-primary);
    background-image: none;
    background-size: none;
    background-position: none;
}`;

    return txt;
}
