import { z } from "zod";

export const createDoctorSchema = z.object({
  userId: z.string(),
  specialization: z.string().min(1),
  qualifications: z.array(z.object({
    degree: z.string(),
    institution: z.string(),
    year: z.number().int(),
  })).optional(),
  schedule: z.object({
    monday: z.array(z.object({ start: z.string(), end: z.string() })).optional(),
    tuesday: z.array(z.object({ start: z.string(), end: z.string() })).optional(),
    wednesday: z.array(z.object({ start: z.string(), end: z.string() })).optional(),
    thursday: z.array(z.object({ start: z.string(), end: z.string() })).optional(),
    friday: z.array(z.object({ start: z.string(), end: z.string() })).optional(),
    saturday: z.array(z.object({ start: z.string(), end: z.string() })).optional(),
    sunday: z.array(z.object({ start: z.string(), end: z.string() })).optional(),
  }).optional(),
});

export const updateDoctorSchema = z.object({
  specialization: z.string().optional(),
  qualifications: z.array(z.any()).optional(),
  schedule: z.any().optional(),
  isAvailable: z.boolean().optional(),
});

export const createLeaveSchema = z.object({
  doctorId: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  reason: z.string().min(1),
});

export const updateLeaveSchema = z.object({
  status: z.enum(["Pending", "Approved", "Rejected"]).optional(),
  reason: z.string().optional(),
});
