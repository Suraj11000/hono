import { Hono } from 'hono';
import { serve } from 'bun';

const app = new Hono();

let cachedTimestamp: string | null = null;
let lastUpdated = 0;
const ISR_INTERVAL = 30000; // 30 seconds

app.get('/', (ctx) => {
  const now = Date.now();

  if (!cachedTimestamp || now - lastUpdated > ISR_INTERVAL) {
    cachedTimestamp = new Date().toISOString();
    lastUpdated = now;
    console.log(`Timestamp updated: ${cachedTimestamp}`);
  } else {
    console.log(`Returning cached timestamp: ${cachedTimestamp}`);
  }

  return ctx.json({ timestamp: cachedTimestamp });
});

// Create the Bun server and attach the Hono app
serve({
  fetch: app.fetch,
  port: 3000,
});

console.log('Bun server running on http://localhost:3000');
