import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { registrations } from '../shared/schema';

// Database setup
const { DATABASE_URL } = process.env;
if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

const neonClient = neon(DATABASE_URL, { fetchOptions: { cache: 'no-store' } });
const db = drizzle(neonClient);

// Ensure schema exists with all survey fields
async function ensureSchema() {
  try {
    console.log("Ensuring database schema...");
    await neonClient`CREATE TABLE IF NOT EXISTS registrations (
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
    
    // Transform frontend field names to database field names
    const {
      email,
      phone,
      isVip,
      ownsPet,
      petType,
      petTypeOther,
      outdoorFrequency,
      lostPetBefore,
      howFoundPet,
      currentTracking,
      currentTrackingSpecify,
      safetyWorries,
      safetyWorriesOther,
      currentSafetyMethods,
      importantFeatures,
      expectedChallenges,
      expectedChallengesOther,
      usefulnessRating,
      wishFeature,
    } = req.body;

    const registrationData = {
      email,
      phone: phone || null,
      isVip: isVip || false,
      ownsPet: ownsPet || null,
      petType: Array.isArray(petType) ? petType : null,
      petTypeOther: petTypeOther || null,
      outdoorFrequency: outdoorFrequency || null,
      hasLostPet: lostPetBefore || null,
      howFoundPet: howFoundPet || null,
      usesTrackingSolution: currentTracking || null,
      trackingSolutionDetails: currentTrackingSpecify || null,
      safetyWorries: Array.isArray(safetyWorries) ? safetyWorries : null,
      safetyWorriesOther: safetyWorriesOther || null,
      currentSafetyMethods: currentSafetyMethods || null,
      importantFeatures: Array.isArray(importantFeatures) ? importantFeatures : null,
      expectedChallenges: Array.isArray(expectedChallenges) ? expectedChallenges : null,
      expectedChallengesOther: expectedChallengesOther || null,
      usefulnessRating: usefulnessRating || null,
      wishFeature: wishFeature || null,
    };

    // Validate email is present
    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        message: "Email is required",
        error: "MISSING_EMAIL"
      });
    }
    
    // Check if email already exists
    const existingRegistration = await db.select()
      .from(registrations)
      .where(eq(registrations.email, email));
    
    if (existingRegistration.length > 0) {
      return res.status(409).json({ 
        message: "Email already registered",
        error: "DUPLICATE_EMAIL"
      });
    }

    const [registration] = await db.insert(registrations)
      .values(registrationData)
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
