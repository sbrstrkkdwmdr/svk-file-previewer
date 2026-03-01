export type icon = {
    code: string,
    colour?: string,
};

export const utils = {
    // pointers
    chevronDown: 'e92e',
    chevronUp: 'e931',
    chevronLeft: 'e92f',
    chevronRight: 'e930',

    chevronDoubleDown: 'e932',
    chevronDoubleUp: 'e935',
    chevronDoubleLeft: 'e933',
    chevronDoubleRight: 'e934',

    arrowDown: 'e90c',
    arrowUp: 'e914',
    arrowLeft: 'e910',
    arrowRight: 'e912',
    arrowDownLeft: 'e90e',
    arrowDownRight: 'e90f',
    arrowUpLeft: 'e916',
    arrowUpRight: 'e917',

    // common actions
    check: 'e92b',
    checkCircle: 'e92c',
    x: 'ea11',
    xCircle: 'ea12',
    cross: 'ea11', // alt
    link: 'e98a',
    search: 'e9cc',
    copy: 'edc9',
    copy_feather: 'e947',
    paste: 'edca',
    external: 'e95e',
    leave: 'ee03',
    menu: 'e998',
    minimise: 'e99d',
    maximise: 'e995',
    minimiseArrow: 'e99e',
    maximiseArrow: 'e996',

    // content
    hide: 'e960',
    show: 'e95f',
    eye: 'e95f', // alt
    info: 'e983',
    at: 'e918',
    briefcase: 'e926',
    edit: 'e95b',
    edit_penonly: 'e95c',
    edit_under: 'e95d',
    code: 'e940',
    lock: 'e98f',
    unlock: 'e9fd',
    location: 'e994',
    mouse: 'e9a6',

    // media
    play: 'e9ba',
    pause: 'e9ae',
    rewind: 'e9c6',
    fastForward: 'e962',
    skipBack: 'e9d8',
    skipForward: 'e9d9',
    shuffle: 'e9d6',
    repeat: 'e9c5',

    // settings
    calendar: 'e927',
    settings: 'e9cf',
    crop: 'e952',
    volumeNone: 'ea09',
    volumeMid: 'ea0a',
    volumeFull: 'ea0b',
    volumeMute: 'ea0c',
    clock: 'e939',

    // internet 
    download: 'e958',
    upload: 'e9fe',
    wifi: 'ea0e',
    wifiNone: 'ea0f',
    person: 'ea00',
    people: 'ea05',
    hash: "e97b",

    // shapes
    circle: 'e937',
    triangle: 'e9f5',
    square: 'e9e0',
    pentagon: 'xxx',
    hexagon: 'e97f',
    heptagon: 'xxx',
    octagon: 'e9ab',

    cube: 'e925',
    box: 'e925',

    sun: 'e9e3',
    moon: 'e9a3',
    star: 'e9e1',
    heart: 'e97d',
    globe: 'e978',

    // content 
    document: 'edc4',
    text: 'e9fa',
    music: 'e9a8',
    audio: 'e97c',
    image: 'e981',
    tv: 'e9f7',
    monitor: 'e9a2',
    video: 'ea06',
    trash: 'e9f0',
    pen: 'e9b0',

    // file types
    fileGeneric: 'e965',
    fileArchive: 'edc8',
    fileText: 'e968',
    fileImage: 'edc5',
    fileAudio: 'edc6',
    fileVideo: 'edc5',
    folder: 'e96c',
    folderOpen: 'e96e',

    // osu
    modeOsu: 'edff',
    modeTaiko: 'ee00',
    modeFruits: 'edfd',
    modeMania: 'edfe',

    layout: 'e988',
    grid: 'e979',
    list: 'e98d',

    // power
    power: 'e9c0',
    battery: 'e91c',
    batteryCharging: 'e91d',
    zap: 'ea16',
    zapOff: 'ea17',

    // tech
    database: 'e954',
    terminal: 'e9e9',
    cpu: 'e950',
    palette: 'xxx',

};

export const sites = {
    discord: ['edfa', '#5865F2'],
    'discord-clear': ['edfa', 'var(--icon-default-highlight)'],
    dropbox: ['eaec', '#0061FF'],
    email: ['e992', 'var(--icon-default-highlight)'],
    github: ['eb3e', 'purple'],
    'github-clear': ['eb3e', 'var(--icon-default-highlight)'],
    instagram: ['eb9c', 'var(--icon-default-highlight)'],
    linkedin: ['ebe1', 'var(--icon-default-highlight)'],
    mediafire: ['ec03', '#0077FF'],
    mega: ['ec07', '#D9272E'],
    osu: ['edbf', '#FF66AA'],
    pronouns: ['edc0', '#C71585'],
    reddit: ['ecae', 'var(--icon-default-highlight)'],
    twitch: ['ed56', 'var(--icon-default-highlight)'],
    twitter: ['ed57', 'var(--icon-default-highlight)'],
    yt: ['edb0', 'red'],
    'yt-clear': ['edb0', 'var(--icon-default-highlight)'/* 'red' */],

    // tech
    csharp: ['eac4', '#239120'],
    css: ['eac5', '#1572b6'],
    go: ['eb4a', '#4ec6e4'],
    godot: ['eb4b', '#478cbf'],
    html: ['eb85', '#e34f26'],
    java: ['ebac', '#007396'],
    js: ['ebad', '#f7df1e'],
    lua: ['ebeb', '#000080'],
    mysql: ['ec2e', '#4479a1'],
    nodejs: ['ec3d', '#339933'],
    php: ['ec6c', '#474A8A'],
    py: ['ec92', '#3776AB'],
    react: ['eca6', '#61DAFB'],
    rs: ['ecc1', '#D34516'],
    svelte: ['ed26', '#FF3E00'],
    ts: ['ed59', '#3178C6'],
};

function toClass(name: string, code: string, colour?: string, hoverclr?: string) {
    let txt = `
.icon-${name}::before {
    content: "\\${code}";
    ${colour ? 'color:' + colour + ';' : ''}
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
        txt += toClass(key, rr[0], rr[1], rr[1]);
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