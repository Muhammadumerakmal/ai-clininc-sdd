import mongoose, { Schema, Document } from "mongoose";

export interface IPatient extends Document {
  userId?: string;
  clinicId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: string;
  phone: string;
  email?: string;
  address?: string;
  bloodGroup?: string;
  medicalHistory: Record<string, unknown>[];
  allergies: string[];
  emergencyContact?: Record<string, unknown>;
  insuranceDetails?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const patientSchema = new Schema<IPatient>(
  {
    userId: { type: String, unique: true, sparse: true },
    clinicId: { type: String, required: true, index: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String },
    bloodGroup: { type: String },
    medicalHistory: { type: [Schema.Types.Mixed], default: [] } as any,
    allergies: { type: [String], default: [] },
    emergencyContact: { type: Schema.Types.Mixed },
    insuranceDetails: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

patientSchema.index({ firstName: 1, lastName: 1 });

export const Patient = mongoose.model<IPatient>("Patient", patientSchema);
