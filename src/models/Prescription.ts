import mongoose, { Schema, Document } from "mongoose";

export interface IPrescription extends Document {
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  medications: Record<string, unknown>[];
  notes?: string;
  isAIGenerated: boolean;
  requiresDoctorApproval: boolean;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const prescriptionSchema = new Schema<IPrescription>(
  {
    patientId: { type: String, required: true, index: true },
    doctorId: { type: String, required: true },
    appointmentId: { type: String },
    medications: { type: [Schema.Types.Mixed], required: true } as any,
    notes: { type: String },
    isAIGenerated: { type: Boolean, default: false },
    requiresDoctorApproval: { type: Boolean, default: true },
    approvedAt: { type: Date },
  },
  { timestamps: true }
);

export const Prescription = mongoose.model<IPrescription>("Prescription", prescriptionSchema);
