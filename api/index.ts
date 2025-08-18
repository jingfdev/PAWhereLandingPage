import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { registerRoutes } from '../server/routes';

// Create an Express app per invocation (Vercel caches between calls)
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
registerRoutes(app);

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Delegate to Express
  // @ts-expect-error: express types vs vercel types mismatch is OK
  return app(req, res);
}


