import { pb } from '$lib/pocketbase';

class SingletonPocketBase {
    private static instance: SingletonPocketBase;
    private listeners: Set<(data: string) => void>;
    private clients: Set<any>; // Track connected WebSocket clients

    private constructor() {
        this.listeners = new Set();
        this.clients = new Set();

        // Subscribe to PocketBase collection changes
        pb.collection('websites').subscribe('*', (event: any) => {
            if (event.action === 'update' || event.action === 'create' || event.action === 'delete') {
                this.notifyListeners(event.record);
                this.broadcastToClients({ type: 'update', data: event.record });
            }
        });
    }

    public static getInstance(): SingletonPocketBase {
        if (!SingletonPocketBase.instance) {
            SingletonPocketBase.instance = new SingletonPocketBase();
        }
        return SingletonPocketBase.instance;
    }

    // Add a listener to the list
    public addListener(listener: (data: string) => void): void {
        this.listeners.add(listener);
    }

    // Remove a listener from the list
    public removeListener(listener: (data: string) => void): void {
        this.listeners.delete(listener);
    }

    // Notify all listeners of a new value
    private notifyListeners(data: string): void {
        for (const listener of this.listeners) {
            try {
                listener(data);
            } catch (error) {
                console.error('Error notifying listener:', error);
            }
        }
    }

    // Add a WebSocket client
    public addClient(client: any): void {
        this.clients.add(client);
    }

    // Remove a WebSocket client
    public removeClient(client: any): void {
        this.clients.delete(client);
    }

    // Broadcast a message to all WebSocket clients
    public broadcastToClients(message: object): void {
        const messageString = JSON.stringify(message);
        for (const client of this.clients) {
            try {
                if (client.readyState === 1) { // WebSocket.OPEN
                    client.send(messageString);
                }
            } catch (error) {
                console.error('Error sending WebSocket message:', error);
            }
        }
    }
}
export default SingletonPocketBase;
