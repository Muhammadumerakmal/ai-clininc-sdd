import { z } from "zod";

export const createAppointmentSchema = z.object({
  patientId: z.string().uuid(),
  doctorId: z.string().uuid(),
  clinicId: z.string().uuid().optional(),
  dateTime: z.coerce.date(),
  reason: z.string().optional(),
  notes: z.string().optional(),
});

export const updateAppointmentSchema = z.object({
  dateTime: z.coerce.date().optional(),
  reason: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(["Scheduled", "Confirmed", "InProgress", "Completed", "Cancelled"]).optional(),
});

export const appointmentQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.string().optional(),
  doctorId: z.string().uuid().optional(),
  patientId: z.string().uuid().optional(),
  clinicId: z.string().uuid().optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
});
