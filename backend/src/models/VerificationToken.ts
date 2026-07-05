import mongoose, { Schema, Document } from "mongoose";

export interface IVerificationToken extends Document {
  userId: string;
  token: string;
  type: string;
  expiresAt: Date;
  usedAt?: Date;
  createdAt: Date;
}

const verificationTokenSchema = new Schema<IVerificationToken>(
  {
    userId: { type: String, required: true, index: true },
    token: { type: String, required: true, unique: true, index: true },
    type: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    usedAt: { type: Date },
  },
  { timestamps: true }
);

export const VerificationToken = mongoose.model<IVerificationToken>("VerificationToken", verificationTokenSchema);
