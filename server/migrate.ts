import { db } from './db';
import { sql } from 'drizzle-orm';
import { users, registrations } from '../shared/schema';

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
        
        -- Section 1: Background Information
        owns_pet TEXT,
        pet_type JSONB,
        pet_type_other TEXT,
        outdoor_frequency TEXT,
        has_lost_pet TEXT,
        how_found_pet TEXT,
        
        -- Section 2: Current Solutions & Pain Points
        uses_tracking_solution TEXT,
        tracking_solution_details TEXT,
        safety_worries JSONB,
        safety_worries_other TEXT,
        current_safety_methods TEXT,
        
        -- Section 3: Expectations for PAWhere
        important_features JSONB,
        expected_challenges JSONB,
        expected_challenges_other TEXT,
        usefulness_rating INTEGER,
        wish_feature TEXT,
        
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
