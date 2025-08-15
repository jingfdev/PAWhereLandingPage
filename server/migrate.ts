import { db } from './db';
import { sql } from 'drizzle-orm';
import { users, registrations } from '@shared/schema';

async function runMigrations() {
  console.log('Running migrations...');
  
  try {
    // Create users table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      )
    `);

    // Create registrations table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS registrations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT NOT NULL,
        phone TEXT,
        is_vip BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `);

    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
}

runMigrations()
  .catch(console.error)
  .finally(() => process.exit());
