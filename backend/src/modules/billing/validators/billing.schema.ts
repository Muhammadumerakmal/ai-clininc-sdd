import { z } from "zod";

export const createInvoiceSchema = z.object({
  patientId: z.string(),
  appointmentId: z.string().optional(),
  subtotal: z.number().positive(),
  taxPercentage: z.number().min(0).max(100).default(0),
  discountPercentage: z.number().min(0).max(100).default(0),
});

export const updateInvoiceSchema = z.object({
  status: z.enum(["Pending", "Paid", "Overdue", "Cancelled"]).optional(),
});

export const createPaymentSchema = z.object({
  invoiceId: z.string(),
  amount: z.number().positive(),
  method: z.enum(["Cash", "Card", "Insurance", "Online"]),
  reference: z.string().optional(),
  notes: z.string().optional(),
});
