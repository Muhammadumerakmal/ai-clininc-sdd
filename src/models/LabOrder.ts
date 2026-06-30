import mongoose, { Schema, Document } from "mongoose";

export interface ILabOrder extends Document {
  patientId: string;
  doctorId: string;
  medicalRecordId?: string;
  testName: string;
  instructions?: string;
  status: string;
  result?: string;
  resultFile?: string;
  reviewedByDoctor: boolean;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const labOrderSchema = new Schema<ILabOrder>(
  {
    patientId: { type: String, required: true },
    doctorId: { type: String, required: true },
    medicalRecordId: { type: String },
    testName: { type: String, required: true },
    instructions: { type: String },
    status: { type: String, default: "Ordered" },
    result: { type: String },
    resultFile: { type: String },
    reviewedByDoctor: { type: Boolean, default: false },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

export const LabOrder = mongoose.model<ILabOrder>("LabOrder", labOrderSchema);
