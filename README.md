# File previewer

basic sveltekit app for sharing files

Is the source code behind [files.sbrstrkkdwmdr.me](https://files.sbrstrkkdwmdr.me/)

## Setup

Install pre-requesites with `npm i`

Run in development mode with `npm run dev`

Compile the app with `npm run build`

Run in preview mode with `npm run preview`

Run in production mode with `npm run preview --host`

## File sharing

To add a file, put it into `/files` (or any subfolders)

If the file is in a subfolder, make sure the subfolder isn't `/app`. `/app` is ignored in order to server some static CSS files and libraries

Make sure directories do not contain any spaces or special characters. Files are ok.

Public folder syncs with the `/files` folder every 60 minutes (can be edited by going into `/src/lib/server/files.ts` and changing `fileSyncTimer`)

## Routes

### /{slug}

Displays all files with paths that match the given slug.

| Params       |                                  |
| ------------ | -------------------------------- |
| `q={string}` | filters by both name and/or path |

### /api/download

Downloads a file

| Params              |                                                                                             |
| ------------------- | ------------------------------------------------------------------------------------------- |
| `name={string}`     | File name including extension eg. `rafis2018hddt.osk`                                       |
| `location={string}` | File path encased in `/` eg. `/skins/farm/`                                                 |
| `preview={boolean}` | Whether to directly download the file or load the preview (if available). Defaults to false |

### /api/files

Returns a list of all files

### TODO

- [ ] download files directly by slug (eg /subfolder/test.png downloads the png)
- [x] add download button to content previews
- [ ] add option to view folder on portrait screens

## Credits

### Fonts

|                                                      |                                                                               |
| ---------------------------------------------------- | ----------------------------------------------------------------------------- |
| [Inter](https://rsms.me/inter/)                      | [SIL-OFL 1.1](https://raw.githubusercontent.com/rsms/inter/v4.1/LICENSE.txt)  |
| [JetBrains Mono](https://www.jetbrains.com/lp/mono/) | [SIL-OFL 1.1](https://github.com/JetBrains/JetBrainsMono/blob/master/OFL.txt) |
