import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import { pgTable, text, varchar, boolean, timestamp } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { sql } from 'drizzle-orm';

// Schema definitions
const registrations = pgTable("registrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  phone: text("phone"),
  isVip: boolean("is_vip").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

const insertRegistrationSchema = createInsertSchema(registrations).pick({
  email: true,
  phone: true,
  isVip: true,
});

export default async function handler(req, res) {
  // Set CORS headers for all requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url, method } = req;
  console.log(`API Request: ${method} ${url}`);

  // Health check endpoint
  if (url?.includes('/health') && method === 'GET') {
    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
      return res.status(500).json({ ok: false, error: 'DATABASE_URL not set' });
    }

    try {
      const neonClient = neon(DATABASE_URL);
      await neonClient`SELECT 1 as test`;
      return res.status(200).json({ 
        ok: true, 
        database: 'connected', 
        timestamp: new Date().toISOString() 
      });
    } catch (error) {
      return res.status(500).json({ 
        ok: false, 
        error: 'Database connection failed',
        details: String(error)
      });
    }
  }

  // Registration endpoint
  if (url?.includes('/register') && method === 'POST') {
    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
      return res.status(500).json({ 
        success: false, 
        error: 'DATABASE_URL not set' 
      });
    }

    try {
      const neonClient = neon(DATABASE_URL, { fetchOptions: { cache: 'no-store' } });
      const db = drizzle(neonClient);

      // Ensure schema exists
      await neonClient`CREATE TABLE IF NOT EXISTS registrations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT NOT NULL UNIQUE,
        phone TEXT,
        is_vip BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`;

      const registrationData = insertRegistrationSchema.parse(req.body);
      
      // Check if email already exists
      const existing = await db.select()
        .from(registrations)
        .where(eq(registrations.email, registrationData.email));
      
      if (existing.length > 0) {
        return res.status(409).json({ 
          success: false,
          message: "Email already registered",
          error: "DUPLICATE_EMAIL"
        });
      }

      const [registration] = await db.insert(registrations)
        .values({
          ...registrationData,
          isVip: registrationData.isVip ?? false,
          phone: registrationData.phone ?? null
        })
        .returning();
      
      return res.status(201).json({ 
        success: true,
        message: "Registration successful",
        registration: {
          id: registration.id,
          email: registration.email,
          isVip: registration.isVip
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid registration data",
          errors: error.errors
        });
      }
      
      return res.status(500).json({ 
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Default info endpoint
  if (method === 'GET') {
    return res.status(200).json({
      message: "PAWhere API",
      endpoints: {
        "GET /api/health": "Database health check",
        "POST /api/register": "User registration"
      },
      request: { method, url },
      timestamp: new Date().toISOString()
    });
  }

  // Method not allowed
  return res.status(405).json({
    error: "Method not allowed",
    method,
    url,
    allowedMethods: ["GET", "POST", "OPTIONS"]
  });
}
