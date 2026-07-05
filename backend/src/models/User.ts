import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  role: string;
  isVerified: boolean;
  isActive: boolean;
  clinicId?: string;
  refreshToken?: string;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, default: "Patient", index: true },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    clinicId: { type: String, index: true },
    refreshToken: { type: String },
    googleId: { type: String, unique: true, sparse: true },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
