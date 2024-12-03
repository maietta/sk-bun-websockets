# **SvelteKit + Bun + WebSockets**

A SvelteKit demo showcasing real-time WebSocket functionality with the Bun adapter, assuming Bun is used as both the package manager for development and runtime in production.

---

## **Features**
- **Singleton PocketBase Instance**: Manages WebSocket updates for real-time UI changes.  
- **Basic Group Chat Example**: Demonstrates routing messages from the frontend to the `broadcastToClients` method in the singleton class for live communication across all visitors.
- **Basic Docker Healthcheck**: A simple endpoint 

---

## **Hosting Requirements**

This application uses `svelte-adapter-bun`, designed for long-running server environments. It is **not compatible** with serverless platforms.  
A **Dockerfile** is included for customization to suit specific hosting requirements.

---

## **Development Setup**

To run the project in development mode, set up two servers:

1. **WebSocket Server**  
   Start the WebSocket server:  
   ```bash
   bun bunServer.ts
   ```

2. **SvelteKit Development Server**  
   Start the SvelteKit development server:  
   ```bash
   bun dev
   ```

---

## **Before You Start**
- Update `src/lib/pocketbase.ts` with your PocketBase connection URL.  
- Update `src/lib/singletonPocketBase.ts` to define the PocketBase collection to monitor in real time.

---

## **Additional Notes**
- Hosting has been tested with **Coolify** and **Caprover**, but will work any place you can run a Dockerfile like the one included.
- Compatible with proxies like **Traefik**, **Caddy**, and **Nginx**.
- For **Caprover**, enable WebSocket support in the app settings. If the **Caprover CLI** is installed, you can use the provided `deploy.sh` script for deployment.
- At the time of this writing, you can get a free instance of Pocketbase at https://pocketbase.io, or you can host your own copy of the MIT Licensed, Open Source software on your own server.
- The Dockerfile is far more verbose than needed, because it includes Node runtime as well. Some dependencies may require it, which is why It's included in my example to help keep you covered in those scenarios.
- This project was adapted from https://github.com/gornostay25/svelte-adapter-bun/tree/master/examples/e2e, but modernized to work with Svelte 5 and updated dependencies.

---

## **Modified or Added Files**

From the stock SvelteKit setup, the following files have been updated or added:

- **`src/lib/pocketbase.ts`**: Establishes the PocketBase connection.  
- **`src/lib/singletonPocketBase.ts`**: Implements a shared PocketBase instance for efficient resource use and real-time database interaction.  
- **`src/routes/+page.svelte`**: Demonstrates sample usage from the frontend.  
- **`src/hooks.server.ts`**: Middleware handling WebSocket events for the long-running server.  
- **`vite.config.ts`**: Configures a proxy server endpoint for development.  
- **`svelte.config.ts`**: Updates the adapter to use `svelte-adapter-bun`.
- **`bunServer.ts`**: A helper websocket server for use during development.

Additionally, the following packages were installed:

- Runtime Dependencies: eventsource, pocketbase
- Development Dependencies: svelte-adapter-bun, @types/bun and @types/eventsource