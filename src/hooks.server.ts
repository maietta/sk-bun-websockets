import type { WebSocketHandler } from 'svelte-adapter-bun';
import SingletonPocketBase from '$lib/singletonPocketBase';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const pb = SingletonPocketBase.getInstance();

const healthcheck: Handle = async ({ event, resolve }) => {
    if (event.url.pathname === '/healthcheck') {
        return new Response('OK', {
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    }

    return resolve(event);
};

const websockets: Handle = async ({ event, resolve }) => {
    return await resolve(event);
};

// Enhanced WebSocket handler (also used in the WebSocket server run separately from the Vite dev server for local development)
export const handleWebsocket: WebSocketHandler = {
    open(ws) {
        pb.addClient(ws);
    },
    close(ws) {
        pb.removeClient(ws);
    },
    message(ws, message) {
        pb.broadcastToClients({ type: 'message', data: message });
    },
    upgrade(request, upgrade) {
        const url = new URL(request.url);
        if (url.pathname.startsWith('/ws')) {
            return upgrade(request);
        }
        return false;
    }
};

export const handle = sequence(healthcheck, websockets);
