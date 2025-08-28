export interface User {
  id: string;
  username: string;
  password: string;
}

export interface InsertUser {
  username: string;
  password: string;
}

export interface Registration {
  id: string;
  email: string;
  phone: string | null;
  isVip: boolean;
  
  // Section 1: Background Information
  ownsPet: string | null;
  petType: string[] | null;
  petTypeOther: string | null;
  outdoorFrequency: string | null;
  hasLostPet: string | null;
  howFoundPet: string | null;
  
  // Section 2: Current Solutions & Pain Points
  usesTrackingSolution: string | null;
  trackingSolutionDetails: string | null;
  safetyWorries: string[] | null;
  safetyWorriesOther: string | null;
  currentSafetyMethods: string | null;
  
  // Section 3: Expectations for PAWhere
  importantFeatures: string[] | null;
  expectedChallenges: string[] | null;
  expectedChallengesOther: string | null;
  usefulnessRating: number | null;
  wishFeature: string | null;
  
  createdAt: Date;
}

export interface InsertRegistration {
  email: string;
  phone?: string | null;
  isVip?: boolean;
  
  // Section 1: Background Information
  ownsPet?: string | null;
  petType?: string[] | null;
  petTypeOther?: string | null;
  outdoorFrequency?: string | null;
  hasLostPet?: string | null;
  howFoundPet?: string | null;
  
  // Section 2: Current Solutions & Pain Points
  usesTrackingSolution?: string | null;
  trackingSolutionDetails?: string | null;
  safetyWorries?: string[] | null;
  safetyWorriesOther?: string | null;
  currentSafetyMethods?: string | null;
  
  // Section 3: Expectations for PAWhere
  importantFeatures?: string[] | null;
  expectedChallenges?: string[] | null;
  expectedChallengesOther?: string | null;
  usefulnessRating?: number | null;
  wishFeature?: string | null;
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createRegistration(registration: InsertRegistration): Promise<Registration>;
  getRegistrations(): Promise<Registration[]>;
  getRegistrationByEmail(email: string): Promise<Registration | undefined>;
}
