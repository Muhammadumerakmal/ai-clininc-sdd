import mongoose, { Schema, Document } from "mongoose";

export interface IClinic extends Document {
  name: string;
  address: string;
  phone: string;
  email: string;
  settings: Record<string, unknown>;
  workingHours: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const clinicSchema = new Schema<IClinic>(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    settings: { type: Schema.Types.Mixed, default: {} },
    workingHours: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const Clinic = mongoose.model<IClinic>("Clinic", clinicSchema);
