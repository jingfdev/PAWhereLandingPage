import { eq } from 'drizzle-orm';
import { db } from './db';
import { users, registrations } from '../shared/schema';
import type { IStorage } from './storage-types';
import type { User, InsertUser, Registration, InsertRegistration } from './storage-types.d';
import { randomUUID } from 'node:crypto';

// Helper function to convert DB registration to our domain model
const toRegistration = (dbReg: any): Registration => ({
  id: dbReg.id,
  email: dbReg.email,
  phone: dbReg.phone ?? null,
  isVip: dbReg.isVip ?? false,
  
  // Section 1: Background Information
  ownsPet: dbReg.ownsPet ?? null,
  petType: dbReg.petType ?? null,
  petTypeOther: dbReg.petTypeOther ?? null,
  outdoorFrequency: dbReg.outdoorFrequency ?? null,
  hasLostPet: dbReg.hasLostPet ?? null,
  howFoundPet: dbReg.howFoundPet ?? null,
  
  // Section 2: Current Solutions & Pain Points
  usesTrackingSolution: dbReg.usesTrackingSolution ?? null,
  trackingSolutionDetails: dbReg.trackingSolutionDetails ?? null,
  safetyWorries: dbReg.safetyWorries ?? null,
  safetyWorriesOther: dbReg.safetyWorriesOther ?? null,
  currentSafetyMethods: dbReg.currentSafetyMethods ?? null,
  
  // Section 3: Expectations for PAWhere
  importantFeatures: dbReg.importantFeatures ?? null,
  expectedChallenges: dbReg.expectedChallenges ?? null,
  expectedChallengesOther: dbReg.expectedChallengesOther ?? null,
  usefulnessRating: dbReg.usefulnessRating ?? null,
  wishFeature: dbReg.wishFeature ?? null,
  
  createdAt: dbReg.createdAt ?? new Date()
});

export class PostgresStorage implements IStorage {
  async getUser(id: string) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser) {
    const [user] = await db.insert(users).values({
      ...insertUser,
    }).returning();
    return user;
  }

  async createRegistration(insertRegistration: InsertRegistration) {
    console.log("Creating registration with data:", insertRegistration);
    
    const [registration] = await db.insert(registrations)
      .values({
        ...insertRegistration,
        isVip: insertRegistration.isVip ?? false,
        phone: insertRegistration.phone ?? null
      })
      .returning();
    
    console.log("Database returned:", registration);
    
    // Return properly typed Registration object with all survey fields
    return toRegistration(registration);
  }

  async getRegistrations() {
    const dbRegistrations = await db.select().from(registrations);
    return dbRegistrations.map(toRegistration);
  }

  async getRegistrationByEmail(email: string) {
    const [registration] = await db.select()
      .from(registrations)
      .where(eq(registrations.email, email));
    return registration ? toRegistration(registration) : undefined;
  }
}
