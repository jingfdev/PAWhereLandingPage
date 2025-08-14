import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertRegistrationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Registration endpoint
  app.post("/api/register", async (req, res) => {
    try {
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
        return res.status(400).json({
          message: "Invalid registration data",
          errors: error.errors
        });
      }
      
      console.error("Registration error:", error);
      res.status(500).json({ 
        message: "Internal server error" 
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

  const httpServer = createServer(app);
  return httpServer;
}
