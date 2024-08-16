import { Hono } from 'hono';

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

// Vercel Node.js handler
export default async function handler(req: any, res: any) {
  const response = await app.fetch(req);
  res.statusCode = response.status;
  res.setHeader('Content-Type', 'application/json');
  res.end(await response.text());
}
