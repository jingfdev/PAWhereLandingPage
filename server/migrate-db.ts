import { db } from './db';
import { sql } from 'drizzle-orm';

async function runMigrations() {
  console.log('Running database migrations...');

  try {
    // Ensure pgcrypto for gen_random_uuid
    await db.execute(sql`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);

    // Create users table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Create registrations table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS registrations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT NOT NULL UNIQUE,
        phone TEXT,
        is_vip BOOLEAN NOT NULL DEFAULT false,
        owns_pet TEXT,
        pet_type JSONB,
        pet_type_other TEXT,
        outdoor_frequency TEXT,
        has_lost_pet TEXT,
        how_found_pet TEXT,
        uses_tracking_solution TEXT,
        tracking_solution_details TEXT,
        safety_worries JSONB,
        safety_worries_other TEXT,
        current_safety_methods TEXT,
        important_features JSONB,
        expected_challenges JSONB,
        expected_challenges_other TEXT,
        usefulness_rating INTEGER,
        wish_feature TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    console.log('Database migrations completed successfully!');
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

runMigrations();
