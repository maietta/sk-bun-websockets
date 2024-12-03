/*
    For local development with Vite, requests get proxied to this server.
    You must run this independently from the Vite dev server.
    Run this server with `bun bunServer.ts`, in a separate terminal. The --bun flag is required to use the bun runtime.
*/

import { handleWebsocket } from "./src/hooks.server"

// and start this server
const server = Bun.serve({
    port: 9998,
    fetch(req, server) {
        const ok = handleWebsocket.upgrade(req, server.upgrade.bind(server))
        if (ok) return;
        return new Response('Upgrade failed :(', { status: 500 });
    },
    websocket: handleWebsocket as any
});

console.log(`Helper Bun server listening on ${server.hostname + ":" + server.port}`);