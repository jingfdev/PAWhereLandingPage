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
    return res.status(405).json({ 
      message: "Method not allowed. Use /api/register for registration.",
      endpoints: {
        "GET /api/health": "Health check",
        "POST /api/register": "User registration"
      }
    });
  }

  return res.status(200).json({ 
    message: "PAWhere API is running",
    endpoints: {
      "GET /api/health": "Health check",
      "POST /api/register": "User registration"
    },
    timestamp: new Date().toISOString()
  });
}


