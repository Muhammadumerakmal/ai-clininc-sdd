import mongoose, { Schema, Document } from "mongoose";

export interface IAppointment extends Document {
  patientId: string;
  doctorId: string;
  clinicId: string;
  dateTime: Date;
  endTime: Date;
  status: string;
  reason?: string;
  notes?: string;
  queueNumber?: number;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    patientId: { type: String, required: true, index: true },
    doctorId: { type: String, required: true, index: true },
    clinicId: { type: String, required: true, index: true },
    dateTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, default: "Scheduled" },
    reason: { type: String },
    notes: { type: String },
    queueNumber: { type: Number },
  },
  { timestamps: true }
);

appointmentSchema.index({ doctorId: 1, dateTime: 1 }, { unique: true });
appointmentSchema.index({ clinicId: 1, dateTime: 1 });
appointmentSchema.index({ doctorId: 1, status: 1 });

export const Appointment = mongoose.model<IAppointment>("Appointment", appointmentSchema);
