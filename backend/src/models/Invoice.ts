import mongoose, { Schema, Document } from "mongoose";

export interface IInvoice extends Document {
  patientId: string;
  appointmentId?: string;
  invoiceNumber: string;
  subtotal: number;
  taxPercentage: number;
  taxAmount: number;
  discountPercentage: number;
  discountAmount: number;
  total: number;
  status: string;
  paidAt?: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const invoiceSchema = new Schema<IInvoice>(
  {
    patientId: { type: String, required: true },
    appointmentId: { type: String },
    invoiceNumber: { type: String, required: true, unique: true, index: true },
    subtotal: { type: Number, required: true },
    taxPercentage: { type: Number, required: true },
    taxAmount: { type: Number, required: true },
    discountPercentage: { type: Number, required: true },
    discountAmount: { type: Number, required: true },
    total: { type: Number, required: true },
    status: { type: String, default: "Pending" },
    paidAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

invoiceSchema.index({ patientId: 1, status: 1 });

export const Invoice = mongoose.model<IInvoice>("Invoice", invoiceSchema);
