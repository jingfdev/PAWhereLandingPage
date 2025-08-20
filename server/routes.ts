import type { Express } from "express";
import { storage } from "./storage";
import { checkConnection, getDbInfo, ensureSchema } from "./db";
import { insertRegistrationSchema } from "../shared/schema";
import { z } from "zod";

export function registerRoutes(app: Express): void {
  
  // Registration endpoint (with and without /api prefix for Vercel rewrites)
  app.post("/api/register", async (req, res) => {
    try {
      console.log("Registration attempt:", req.body);
      await ensureSchema();
      const registrationData = insertRegistrationSchema.parse(req.body);
      
      // Check if email already exists
      const existingRegistration = await storage.getRegistrationByEmail(registrationData.email);
      if (existingRegistration) {
        return res.status(409).json({ 
          message: "Email already registered",
          error: "DUPLICATE_EMAIL"
        });
      }

      const registration = await storage.createRegistration(registrationData);
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
  });
  app.post("/register", async (req, res) => {
    try {
      console.log("Registration attempt (no /api):", req.body);
      await ensureSchema();
      const registrationData = insertRegistrationSchema.parse(req.body);
      const existingRegistration = await storage.getRegistrationByEmail(registrationData.email);
      if (existingRegistration) {
        return res.status(409).json({ 
          message: "Email already registered",
          error: "DUPLICATE_EMAIL"
        });
      }
      const registration = await storage.createRegistration(registrationData);
      console.log("Registration successful (no /api):", registration);
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
        console.error("Validation error (no /api):", error.errors);
        return res.status(400).json({
          message: "Invalid registration data",
          errors: error.errors
        });
      }
      console.error("Registration error (no /api):", error);
      res.status(500).json({ 
        message: "Internal server error",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Get all registrations endpoint (for admin purposes)
  app.get("/api/registrations", async (req, res) => {
    try {
      const registrations = await storage.getRegistrations();
      res.json(registrations);
    } catch (error) {
      console.error("Get registrations error:", error);
      res.status(500).json({ 
        message: "Internal server error" 
      });
    }
  });
  app.get("/registrations", async (req, res) => {
    try {
      const registrations = await storage.getRegistrations();
      res.json(registrations);
    } catch (error) {
      console.error("Get registrations error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Database health check
  app.get("/api/health/db", async (_req, res) => {
    const ok = await checkConnection();
    res.status(ok ? 200 : 500).json({ ok, info: getDbInfo() });
  });
  app.get("/health/db", async (_req, res) => {
    const ok = await checkConnection();
    res.status(ok ? 200 : 500).json({ ok, info: getDbInfo() });
  });
}
