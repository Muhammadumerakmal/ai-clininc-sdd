import mongoose, { Schema, Document } from "mongoose";

export interface IMedicine extends Document {
  name: string;
  genericName: string;
  category: string;
  unit: string;
  price: number;
  stockQuantity: number;
  minStockLevel: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const medicineSchema = new Schema<IMedicine>(
  {
    name: { type: String, required: true },
    genericName: { type: String, required: true },
    category: { type: String, required: true },
    unit: { type: String, required: true },
    price: { type: Number, required: true },
    stockQuantity: { type: Number, default: 0 },
    minStockLevel: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Medicine = mongoose.model<IMedicine>("Medicine", medicineSchema);
