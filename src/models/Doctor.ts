import mongoose, { Schema, Document } from "mongoose";

export interface IDoctor extends Document {
  userId: string;
  specialization: string;
  qualifications: Record<string, unknown>[];
  schedule?: Record<string, unknown>;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const doctorSchema = new Schema<IDoctor>(
  {
    userId: { type: String, required: true, unique: true },
    specialization: { type: String, required: true },
    qualifications: { type: [Schema.Types.Mixed], default: [] },
    schedule: { type: Schema.Types.Mixed },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Doctor = mongoose.model<IDoctor>("Doctor", doctorSchema);
