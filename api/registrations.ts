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
      message: "Method not allowed",
      error: "INVALID_METHOD"
    });
  }

  // This endpoint lists registered users (for admin/testing purposes)
  return res.status(200).json({
    message: "Registrations endpoint - use POST /api/register to register",
    note: "This endpoint is for testing. Use POST /api/register for actual registration."
  });
}
