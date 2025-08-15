import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@shared/schema';
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

// Create a PostgreSQL client
const queryClient = postgres(process.env.DATABASE_URL, {
  ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
});

// Create the database client with the schema
export const db = drizzle(queryClient, { schema });

// Helper function to check database connection
export async function checkConnection() {
  try {
    // Try a simple query to check the connection
    const result = await queryClient`SELECT 1 as test`;
    console.log('Database connection test result:', result);
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
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
