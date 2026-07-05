import { z } from "zod";

export const createPatientSchema = z.object({
  userId: z.string().uuid().optional(),
  clinicId: z.string().uuid().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.coerce.date(),
  gender: z.enum(["Male", "Female", "Other"]),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  email: z.string().email().optional(),
  address: z.string().optional(),
  bloodGroup: z.string().optional(),
  medicalHistory: z.array(z.object({
    condition: z.string(),
    diagnosedDate: z.string().optional(),
    notes: z.string().optional(),
  })).optional(),
  allergies: z.array(z.string()).optional(),
  emergencyContact: z.object({
    name: z.string(),
    relationship: z.string(),
    phone: z.string(),
  }).optional(),
  insuranceDetails: z.object({
    provider: z.string(),
    policyNumber: z.string(),
    expiryDate: z.string().optional(),
  }).optional(),
});

export const updatePatientSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().min(10).optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  bloodGroup: z.string().optional(),
  medicalHistory: z.array(z.any()).optional(),
  allergies: z.array(z.string()).optional(),
  emergencyContact: z.object({
    name: z.string(),
    relationship: z.string(),
    phone: z.string(),
  }).optional(),
  insuranceDetails: z.object({
    provider: z.string(),
    policyNumber: z.string(),
    expiryDate: z.string().optional(),
  }).optional(),
});

export const patientQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  clinicId: z.string().uuid().optional(),
});
