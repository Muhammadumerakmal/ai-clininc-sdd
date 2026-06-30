import mongoose, { Schema, Document } from "mongoose";

export interface ILeaveRecord extends Document {
  doctorId: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const leaveRecordSchema = new Schema<ILeaveRecord>(
  {
    doctorId: { type: String, required: true, index: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },
    status: { type: String, default: "Pending" },
  },
  { timestamps: true }
);

export const LeaveRecord = mongoose.model<ILeaveRecord>("LeaveRecord", leaveRecordSchema);
