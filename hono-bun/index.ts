import { Hono } from 'hono';
import { serve } from 'bun';

const app = new Hono();

let cachedTimestamp: string | null = null;
let lastUpdated = 0;
const ISR_INTERVAL = 30000; // 30 seconds

app.get('/timestamp', (ctx) => {
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

// Vercel Node.js handler
export default async function handler(req: Request, res: Response) {
  return app.fetch(req);
}
