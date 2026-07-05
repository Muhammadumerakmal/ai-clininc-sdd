import { z } from "zod";

export const chatSchema = z.object({
  message: z.string().min(1),
  context: z.object({
    patientId: z.string().optional(),
    appointmentId: z.string().optional(),
  }).optional(),
});

export const symptomAnalysisSchema = z.object({
  symptoms: z.array(z.string()).min(1),
  patientId: z.string().optional(),
});

export const diagnosisSuggestionSchema = z.object({
  symptoms: z.array(z.string()),
  testResults: z.string().optional(),
  patientHistory: z.string().optional(),
});

export const prescriptionDraftSchema = z.object({
  diagnosis: z.string().min(1),
  patientId: z.string(),
  doctorId: z.string(),
});
