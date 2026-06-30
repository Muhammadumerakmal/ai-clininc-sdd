import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  invoiceId: string;
  amount: number;
  method: string;
  reference?: string;
  notes?: string;
  createdAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    invoiceId: { type: String, required: true },
    amount: { type: Number, required: true },
    method: { type: String, required: true },
    reference: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Payment = mongoose.model<IPayment>("Payment", paymentSchema);
