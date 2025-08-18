import express from 'express';
import { registerRoutes } from '../server/routes';

// Create an Express app per invocation (Vercel caches between calls)
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
registerRoutes(app);

export default function handler(req: any, res: any) {
  return (app as any)(req, res);
}


