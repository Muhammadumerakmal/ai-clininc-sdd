import mongoose, { Schema, Document } from "mongoose";

export interface IDepartment extends Document {
  name: string;
  description?: string;
  clinicId: string;
  createdAt: Date;
  updatedAt: Date;
}

const departmentSchema = new Schema<IDepartment>(
  {
    name: { type: String, required: true },
    description: { type: String },
    clinicId: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

export const Department = mongoose.model<IDepartment>("Department", departmentSchema);
