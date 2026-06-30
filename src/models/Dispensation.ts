import mongoose, { Schema, Document } from "mongoose";

export interface IDispensation extends Document {
  prescriptionId: string;
  medicineId: string;
  quantity: number;
  pharmacistId: string;
  notes?: string;
  createdAt: Date;
}

const dispensationSchema = new Schema<IDispensation>(
  {
    prescriptionId: { type: String, required: true },
    medicineId: { type: String, required: true },
    quantity: { type: Number, required: true },
    pharmacistId: { type: String, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Dispensation = mongoose.model<IDispensation>("Dispensation", dispensationSchema);
