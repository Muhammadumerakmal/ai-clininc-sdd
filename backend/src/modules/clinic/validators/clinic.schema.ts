import { z } from "zod";

export const createClinicSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  settings: z.any().optional(),
  workingHours: z.any().optional(),
});

export const updateClinicSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  settings: z.any().optional(),
  workingHours: z.any().optional(),
});

export const createDepartmentSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  clinicId: z.string(),
});
