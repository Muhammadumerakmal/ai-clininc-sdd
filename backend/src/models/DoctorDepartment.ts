import mongoose, { Schema, Document } from "mongoose";

export interface IDoctorDepartment extends Document {
  doctorId: string;
  departmentId: string;
  createdAt: Date;
}

const doctorDepartmentSchema = new Schema<IDoctorDepartment>(
  {
    doctorId: { type: String, required: true },
    departmentId: { type: String, required: true },
  },
  { timestamps: true }
);

doctorDepartmentSchema.index({ doctorId: 1, departmentId: 1 }, { unique: true });

export const DoctorDepartment = mongoose.model<IDoctorDepartment>("DoctorDepartment", doctorDepartmentSchema);
