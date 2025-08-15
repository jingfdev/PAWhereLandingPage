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
  createdAt: Date;
}

export interface InsertRegistration {
  email: string;
  phone?: string | null;
  isVip?: boolean;
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createRegistration(registration: InsertRegistration): Promise<Registration>;
  getRegistrations(): Promise<Registration[]>;
  getRegistrationByEmail(email: string): Promise<Registration | undefined>;
}
