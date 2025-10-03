# File previewer

basic sveltekit app for sharing files

Is the source code behind [files.sbrstrkkdwmdr.me](https://files.sbrstrkkdwmdr.me/files)

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
