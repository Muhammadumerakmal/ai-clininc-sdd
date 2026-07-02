import mongoose, { Schema, Document } from "mongoose";

export interface IMedicalRecord extends Document {
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  consultationNotes: string;
  diagnosis?: string;
  treatmentPlan?: string;
  vitals?: Record<string, unknown>;
  attachments: Record<string, unknown>[];
  aiSummary?: string;
  createdAt: Date;
  updatedAt: Date;
}

const medicalRecordSchema = new Schema<IMedicalRecord>(
  {
    patientId: { type: String, required: true, index: true },
    doctorId: { type: String, required: true },
    appointmentId: { type: String, unique: true, sparse: true },
    consultationNotes: { type: String, required: true },
    diagnosis: { type: String },
    treatmentPlan: { type: String },
    vitals: { type: Schema.Types.Mixed },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    attachments: { type: [Schema.Types.Mixed], default: [] } as any,
    aiSummary: { type: String },
  },
  { timestamps: true }
);

export const MedicalRecord = mongoose.model<IMedicalRecord>("MedicalRecord", medicalRecordSchema);
