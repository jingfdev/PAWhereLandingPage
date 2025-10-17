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
    
    // First check if table exists and what columns it has
    const tableInfo = await neonClient`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'registrations'
      ORDER BY ordinal_position;
    `;
    
    console.log("Current table columns:", tableInfo);
    
    // Create table with all fields if it doesn't exist
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
  // Set CORS headers for mobile and desktop compatibility
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Content-Type', 'application/json');

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
    console.log("Registration attempt from", req.method, req.path);
    await ensureSchema();
    
    // Get body safely - handle both JSON and form-urlencoded
    let bodyData = req.body;
    if (typeof bodyData === 'string') {
      try {
        bodyData = JSON.parse(bodyData);
      } catch (e) {
        console.error("Failed to parse body as JSON:", e);
      }
    }
    
    // Log the raw request body to see what we're receiving
    console.log("Raw request body keys:", Object.keys(bodyData));
    console.log("Raw request body:", JSON.stringify(bodyData, null, 2));
    
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
    } = bodyData;

    // Log each field individually to debug
    console.log("Individual field values:");
    console.log("- email:", email);
    console.log("- phone:", phone);
    console.log("- ownsPet:", ownsPet);
    console.log("- petType:", petType);
    console.log("- outdoorFrequency:", outdoorFrequency);
    console.log("- lostPetBefore:", lostPetBefore);
    console.log("- howFoundPet:", howFoundPet);
    console.log("- currentTracking:", currentTracking);
    console.log("- currentTrackingSpecify:", currentTrackingSpecify);
    console.log("- safetyWorries:", safetyWorries);
    console.log("- currentSafetyMethods:", currentSafetyMethods);
    console.log("- importantFeatures:", importantFeatures);
    console.log("- expectedChallenges:", expectedChallenges);
    console.log("- usefulnessRating:", usefulnessRating);
    console.log("- wishFeature:", wishFeature);

    const registrationData = {
      email: email?.trim(),
      phone: phone?.trim() || null,
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
      usefulnessRating: usefulnessRating ? parseInt(usefulnessRating) : null,
      wishFeature: wishFeature || null,
    };

    console.log("Transformed registration data:");
    console.log("Keys:", Object.keys(registrationData));
    console.log("Data:", JSON.stringify(registrationData, null, 2));

    // Validate email is present and properly formatted
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        error: "MISSING_EMAIL",
        receivedFields: {
          email: email,
          phone: phone
        }
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof email !== 'string' || !emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email format",
        error: "INVALID_EMAIL_FORMAT",
        receivedEmail: email,
        receivedEmailType: typeof email
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
