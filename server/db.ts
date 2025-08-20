import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { sql } from 'drizzle-orm';
import * as schema from '../shared/schema';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({
  path: path.resolve(process.cwd(), '.env')
});

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

console.log('Connecting to database with URL:', 
  process.env.DATABASE_URL.replace(/:([^:]+)@/, ':***@'));

const useNeonHttp = !!process.env.VERCEL || /neon\.tech/i.test(process.env.DATABASE_URL || "");

let db: ReturnType<typeof drizzlePostgres> | ReturnType<typeof drizzleNeon>;

// Helper function to check database connection
export async function checkConnection() {
  try {
    if (useNeonHttp) {
      const neonClient = neon(process.env.DATABASE_URL!, { fetchOptions: { cache: 'no-store' } });
      const rows = await neonClient`SELECT 1 as test`;
      console.log('Database connection test result (neon-http):', rows);
    } else {
      const queryClient = postgres(process.env.DATABASE_URL!, {
        ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
      });
      const result = await queryClient`SELECT 1 as test`;
      console.log('Database connection test result (postgres-js):', result);
      await queryClient.end({ timeout: 1 });
    }
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

if (useNeonHttp) {
  const neonClient = neon(process.env.DATABASE_URL!, { fetchOptions: { cache: 'no-store' } });
  db = drizzleNeon(neonClient, { schema });
} else {
  const queryClient = postgres(process.env.DATABASE_URL!, {
    ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
  });
  db = drizzlePostgres(queryClient, { schema });
}

export { db };

export function getDbInfo() {
  const url = process.env.DATABASE_URL || "";
  const masked = url.replace(/:\/\/([^:]+):[^@]+@/, '://$1:***@');
  const host = (() => {
    try {
      const u = new URL(url);
      return u.host;
    } catch {
      return "";
    }
  })();
  return { driver: useNeonHttp ? 'neon-http' : 'postgres-js', hasUrl: !!url, urlMasked: masked, host };
}

// Ensure required extension and tables exist (idempotent)
export async function ensureSchema() {
  try {
    console.log("Ensuring database schema...");
    if (useNeonHttp) {
      const client = neon(process.env.DATABASE_URL!, { fetchOptions: { cache: 'no-store' } });
      await client`CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`;
      await client`CREATE TABLE IF NOT EXISTS registrations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT NOT NULL UNIQUE,
        phone TEXT,
        is_vip BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`;
      console.log("Schema ensured successfully (neon-http)");
    } else {
      const client = postgres(process.env.DATABASE_URL!, {
        ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
      });
      await client`CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`;
      await client`CREATE TABLE IF NOT EXISTS registrations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT NOT NULL UNIQUE,
        phone TEXT,
        is_vip BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )`;
      await client.end({ timeout: 1 });
      console.log("Schema ensured successfully (postgres-js)");
    }
  } catch (error) {
    console.error('Schema ensure error:', error);
    throw error;
  }
}

// Test the connection when this module is imported
checkConnection().then(connected => {
  if (connected) {
    console.log('Successfully connected to the database');
  } else {
    console.error('Failed to connect to the database');
  }
});

// Attempt to ensure schema at startup (safe if already exists)
ensureSchema();
