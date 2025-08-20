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

// Database setup
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

const neonClient = neon(DATABASE_URL, { fetchOptions: { cache: 'no-store' } });
const db = drizzle(neonClient);

// Ensure schema exists
async function ensureSchema() {
  try {
    console.log("Ensuring database schema...");
    await neonClient`CREATE TABLE IF NOT EXISTS registrations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT NOT NULL UNIQUE,
      phone TEXT,
      is_vip BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )`;
    console.log("Schema ensured successfully");
  } catch (error) {
    console.error('Schema ensure error:', error);
    throw error;
  }
}

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ 
      message: "Method not allowed",
      error: "INVALID_METHOD",
      method: req.method,
      allowedMethods: ['POST', 'OPTIONS']
    });
  }

  try {
    console.log("Registration attempt:", req.body);
    await ensureSchema();
    const registrationData = insertRegistrationSchema.parse(req.body);
    
    // Check if email already exists
    const existingRegistration = await db.select()
      .from(registrations)
      .where(eq(registrations.email, registrationData.email));
    
    if (existingRegistration.length > 0) {
      return res.status(409).json({ 
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
    
    console.log("Registration successful:", registration);
    
    res.status(201).json({ 
      message: "Registration successful",
      registration: {
        id: registration.id,
        email: registration.email,
        isVip: registration.isVip
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.errors);
      return res.status(400).json({
        message: "Invalid registration data",
        errors: error.errors
      });
    }
    
    console.error("Registration error:", error);
    res.status(500).json({ 
      message: "Internal server error",
      error: error instanceof Error ? error.message : String(error)
    });
  }
}
