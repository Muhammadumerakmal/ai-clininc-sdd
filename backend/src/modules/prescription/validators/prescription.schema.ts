import { z } from "zod";

const medicationSchema = z.object({
  medicineId: z.string(),
  name: z.string(),
  dosage: z.string(),
  frequency: z.string(),
  duration: z.string(),
  notes: z.string().optional(),
});

export const createPrescriptionSchema = z.object({
  patientId: z.string(),
  doctorId: z.string(),
  appointmentId: z.string().optional(),
  medications: z.array(medicationSchema).min(1, "At least one medication is required"),
  notes: z.string().optional(),
  isAIGenerated: z.boolean().default(false),
  requiresDoctorApproval: z.boolean().default(true),
});

export const updatePrescriptionSchema = z.object({
  medications: z.array(medicationSchema).optional(),
  notes: z.string().optional(),
  requiresDoctorApproval: z.boolean().optional(),
});

export const approvePrescriptionSchema = z.object({
  approved: z.boolean(),
});
