import { db } from './db';
import { sql } from 'drizzle-orm';

async function addSurveyFields() {
  console.log('Adding survey fields to registrations table...');
  
  try {
    // Add new survey fields to existing registrations table
    await db.execute(sql`
      ALTER TABLE registrations 
      ADD COLUMN IF NOT EXISTS owns_pet TEXT,
      ADD COLUMN IF NOT EXISTS pet_type JSONB,
      ADD COLUMN IF NOT EXISTS pet_type_other TEXT,
      ADD COLUMN IF NOT EXISTS outdoor_frequency TEXT,
      ADD COLUMN IF NOT EXISTS has_lost_pet TEXT,
      ADD COLUMN IF NOT EXISTS how_found_pet TEXT,
      ADD COLUMN IF NOT EXISTS uses_tracking_solution TEXT,
      ADD COLUMN IF NOT EXISTS tracking_solution_details TEXT,
      ADD COLUMN IF NOT EXISTS safety_worries JSONB,
      ADD COLUMN IF NOT EXISTS safety_worries_other TEXT,
      ADD COLUMN IF NOT EXISTS current_safety_methods TEXT,
      ADD COLUMN IF NOT EXISTS important_features JSONB,
      ADD COLUMN IF NOT EXISTS expected_challenges JSONB,
      ADD COLUMN IF NOT EXISTS expected_challenges_other TEXT,
      ADD COLUMN IF NOT EXISTS usefulness_rating INTEGER,
      ADD COLUMN IF NOT EXISTS wish_feature TEXT
    `);

    console.log('Survey fields added successfully!');
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
}

addSurveyFields()
  .catch(console.error)
  .finally(() => process.exit());
