import postgres from 'postgres';

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET, OPTIONS');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    return res.status(500).json({ ok: false, error: 'DATABASE_URL not set' });
  }

  const sql = postgres(DATABASE_URL, { ssl: { rejectUnauthorized: false } });
  try {
    const result = await sql`SELECT 1 as ok`;
    await sql.end();
    return res.status(200).json({ ok: true, database: 'connected', result });
  } catch (err) {
    try { await sql.end(); } catch (_) {}
    return res.status(500).json({ ok: false, error: String(err) });
  }
}
