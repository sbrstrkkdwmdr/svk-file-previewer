import { createServer } from "http";
import { handler } from "./build/handler.js";
import { existsSync } from "fs";
import { loadEnvFile } from "process";

if (existsSync("./.env")) {
    console.log(".env file found!\nLoading...");
    loadEnvFile("./.env");
} else {
    console.log(".env file not found.");
}

const port = process.env.PORT || 3000;

const server = createServer((req, res) => {
    try {
        decodeURI(req.url);
    } catch (e) {
        const invalidUriPath = `/invalid${encodeURI(req.url)}`;
        req.url = invalidUriPath;
    } finally {
        handler(req, res);
    }
});

server.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});
