import { z } from "zod";

export const createMedicalRecordSchema = z.object({
  patientId: z.string(),
  doctorId: z.string(),
  appointmentId: z.string().optional(),
  consultationNotes: z.string().min(1, "Consultation notes are required"),
  diagnosis: z.string().optional(),
  treatmentPlan: z.string().optional(),
  vitals: z.object({
    bloodPressure: z.string().optional(),
    heartRate: z.number().int().optional(),
    temperature: z.number().optional(),
    respiratoryRate: z.number().int().optional(),
    oxygenSaturation: z.number().optional(),
    weight: z.number().optional(),
    height: z.number().optional(),
  }).optional(),
  attachments: z.array(z.object({
    name: z.string(),
    url: z.string(),
    type: z.string(),
  })).optional(),
  aiSummary: z.string().optional(),
});

export const updateMedicalRecordSchema = z.object({
  consultationNotes: z.string().optional(),
  diagnosis: z.string().optional(),
  treatmentPlan: z.string().optional(),
  vitals: z.object({
    bloodPressure: z.string().optional(),
    heartRate: z.number().int().optional(),
    temperature: z.number().optional(),
    respiratoryRate: z.number().int().optional(),
    oxygenSaturation: z.number().optional(),
    weight: z.number().optional(),
    height: z.number().optional(),
  }).optional(),
  attachments: z.array(z.any()).optional(),
});
