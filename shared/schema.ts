import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, timestamp, jsonb, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const registrations = pgTable("registrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  phone: text("phone"),
  isVip: boolean("is_vip").default(false),
  
  // Section 1: Background Information
  ownsPet: text("owns_pet"), // "yes" | "no"
  petType: jsonb("pet_type").$type<string[]>(), // array of pet types
  petTypeOther: text("pet_type_other"),
  outdoorFrequency: text("outdoor_frequency"), // "rarely" | "sometimes" | "often"
  hasLostPet: text("has_lost_pet"), // "yes" | "no"
  howFoundPet: text("how_found_pet"),
  
  // Section 2: Current Solutions & Pain Points
  usesTrackingSolution: text("uses_tracking_solution"), // "yes" | "no"
  trackingSolutionDetails: text("tracking_solution_details"),
  safetyWorries: jsonb("safety_worries").$type<string[]>(), // array of worries
  safetyWorriesOther: text("safety_worries_other"),
  currentSafetyMethods: text("current_safety_methods"),
  
  // Section 3: Expectations for PAWhere
  importantFeatures: jsonb("important_features").$type<string[]>(), // array of features
  expectedChallenges: jsonb("expected_challenges").$type<string[]>(), // array of challenges
  expectedChallengesOther: text("expected_challenges_other"),
  usefulnessRating: integer("usefulness_rating"), // 1-10
  wishFeature: text("wish_feature"),
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertRegistrationSchema = createInsertSchema(registrations).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
export type Registration = typeof registrations.$inferSelect;
