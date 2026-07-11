import { z } from "zod";

export const createLabOrderSchema = z.object({
  patientId: z.string(),
  doctorId: z.string(),
  medicalRecordId: z.string().optional(),
  testName: z.string().min(1, "Test name is required"),
  instructions: z.string().optional(),
});

export const updateLabOrderSchema = z.object({
  status: z.enum(["Ordered", "Collected", "Processing", "Completed", "Cancelled"]).optional(),
  result: z.string().optional(),
  resultFile: z.string().optional(),
});

export const reviewLabOrderSchema = z.object({
  reviewedByDoctor: z.boolean(),
});
