import postgres from 'postgres';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
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
