export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
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
