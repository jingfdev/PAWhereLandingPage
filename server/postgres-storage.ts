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
      id: randomUUID(),
      ...insertUser,
    }).returning();
    return user;
  }

  async createRegistration(insertRegistration: InsertRegistration) {
    const [registration] = await db.insert(registrations)
      .values({
        id: randomUUID(),
        ...insertRegistration,
        isVip: insertRegistration.isVip ?? false,
        phone: insertRegistration.phone ?? null
      })
      .returning();
    
    // Ensure we return a properly typed Registration object
    return {
      id: registration.id,
      email: registration.email,
      phone: registration.phone,
      isVip: registration.isVip ?? false,
      createdAt: registration.createdAt ?? new Date()
    };
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
