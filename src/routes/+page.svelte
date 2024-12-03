<script lang="ts">
    import { browser } from "$app/environment";
    let ws: WebSocket | null = null;
    let connecting = $state(true);
    let connected = $state(false);
    let messages: string[] = $state([]);
    let sendValue: string = $state("");
    let reconnectInterval: any;
    function connectWebSocket() {
      console.log("Attempting WebSocket connection...");
      // If url provides https, switch to wss
      const protocol = location.protocol === "https:" ? "wss" : "ws";
      ws = new WebSocket(`${protocol}://${location.host}/ws`);
  
      ws.addEventListener("open", () => {
        console.log("WebSocket connected");
        connected = true;
        connecting = false;
        clearInterval(reconnectInterval);
        // startPinging();
      });
      ws.addEventListener("close", () => {
        console.log("WebSocket disconnected");
        connected = false;
        connecting = false;
        if (!reconnectInterval) {
          reconnectInterval = setInterval(connectWebSocket, 5000); // Retry every 5 seconds
        }
      });
      ws.addEventListener("message", (ev) => {
        const msg = ev.data;
        messages = [...messages, msg].slice(-50); // Keep only the last 50 messages
      });
      ws.addEventListener("error", (ev) => {
        console.error("WebSocket error:", ev);
      });
    }
    function sendMsg() {
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        console.warn("WebSocket is not open. Cannot send message.");
        return;
      }
      ws.send(sendValue);
      sendValue = "";
    }
    if (browser) {
      connectWebSocket();
    }
  </script>
  
  <h1>Demo page</h1>
  
  <div>
    <h3>Connection status</h3>
    <div>
      Connecting: <span data-testid="connecting">{connecting.toString()}</span>
    </div>
    <div>
      Connected: <span data-testid="connected">{connected.toString()}</span>
    </div>
  </div>
  
  <div>
    <h3>Messages</h3>
    <ul data-testid="messages">
      {#each messages as message, index}
        <li>{message}</li>
      {/each}
    </ul>
  </div>
  
  <div>
    <h3>Send</h3>
    <form onsubmit={sendMsg}>
      <input data-testid="send" placeholder="payload" bind:value={sendValue} />
      <button
        data-testid="submit"
        type="submit"
        disabled={!connected || !sendValue}>Send</button
      >
    </form>
  </div>
  