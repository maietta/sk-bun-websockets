import PocketBase from 'pocketbase';
import eventsource from 'eventsource';

// global.EventSource = eventsource as unknown as typeof EventSource;
globalThis.EventSource = eventsource as unknown as typeof EventSource;
const pb = new PocketBase("https://your-pocketbase-url.com");

pb.autoCancellation(false);

export { pb };