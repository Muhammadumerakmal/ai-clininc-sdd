import { z } from "zod";

export const createMedicineSchema = z.object({
  name: z.string().min(1, "Name is required"),
  genericName: z.string().min(1, "Generic name is required"),
  category: z.string().min(1, "Category is required"),
  unit: z.string().min(1, "Unit is required"),
  price: z.number().positive(),
  stockQuantity: z.number().int().min(0).default(0),
  minStockLevel: z.number().int().min(0),
});

export const updateMedicineSchema = z.object({
  name: z.string().optional(),
  genericName: z.string().optional(),
  category: z.string().optional(),
  unit: z.string().optional(),
  price: z.number().positive().optional(),
  stockQuantity: z.number().int().min(0).optional(),
  minStockLevel: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const dispenseSchema = z.object({
  prescriptionId: z.string().min(1),
  medicineId: z.string().min(1),
  quantity: z.number().int().positive(),
  notes: z.string().optional(),
});
