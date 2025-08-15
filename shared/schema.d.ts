// This file provides TypeScript types for the shared schema

declare module '@shared/schema' {
  interface User {
    id: string;
    username: string;
    password: string;
  }

  interface InsertUser {
    username: string;
    password: string;
  }

  interface Registration {
    id: string;
    email: string;
    phone?: string | null;
    isVip: boolean;
    createdAt: Date;
  }

  interface InsertRegistration {
    email: string;
    phone?: string;
    isVip?: boolean;
  }

  // These will be populated by the actual implementation
  export const users: any;
  export const registrations: any;
  
  export const insertUserSchema: any;
  export const insertRegistrationSchema: any;
}
