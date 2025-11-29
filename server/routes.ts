import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPreorderSchema } from "@shared/schema";
import { z } from "zod";
import nodemailer from "nodemailer";

// Email configuration - Simple Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Preorder submission endpoint
  app.post("/api/preorders", async (req, res) => {
    try {
      // Validate request body
      const validatedData = insertPreorderSchema.parse(req.body);
      
      // Save to database
      const preorder = await storage.createPreorder(validatedData);
      
      // Send email notification to founder
      if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
        try {
          const emailContent = `
            <h2>New ZERO Preorder Request</h2>
            <p><strong>Email:</strong> ${preorder.email}</p>
            <p><strong>Shipping Details:</strong></p>
            <pre>${preorder.shippingDetails}</pre>
            <p><strong>Rating:</strong> ${preorder.rating}/5 ⭐</p>
            <p><strong>Submitted:</strong> ${preorder.createdAt.toLocaleString()}</p>
            <hr>
            <p><em>Order ID: ${preorder.id}</em></p>
          `;
          
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: 'founderzero1@gmail.com',
            subject: `New Preorder Request - ${preorder.email}`,
            html: emailContent,
            text: `New ZERO Preorder\n\nEmail: ${preorder.email}\nShipping: ${preorder.shippingDetails}\nRating: ${preorder.rating}/5\nID: ${preorder.id}`
          });
        } catch (emailError) {
          console.error("Email error:", emailError instanceof Error ? emailError.message : emailError);
          // Don't fail the request if email fails - the order is still saved
        }
      }
      
      res.status(201).json({ 
        success: true, 
        message: "Preorder received successfully",
        orderId: preorder.id 
      });
      
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          error: "Invalid request data", 
          details: error.errors 
        });
      } else {
        console.error("Error processing preorder:", error);
        res.status(500).json({ 
          success: false, 
          error: "Failed to process preorder" 
        });
      }
    }
  });
  
  // Get all preorders (for admin/founder to view)
  app.get("/api/preorders", async (req, res) => {
    try {
      const preorders = await storage.getAllPreorders();
      res.json(preorders);
    } catch (error) {
      console.error("Error fetching preorders:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch preorders" 
      });
    }
  });

  return httpServer;
}
