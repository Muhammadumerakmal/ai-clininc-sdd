import mongoose, { Schema, Document } from "mongoose";

export interface IAIInteraction extends Document {
  userId: string;
  requestType: string;
  prompt: string;
  response: string;
  wasApproved?: boolean;
  approvedBy?: string;
  createdAt: Date;
}

const aiInteractionSchema = new Schema<IAIInteraction>(
  {
    userId: { type: String, required: true, index: true },
    requestType: { type: String, required: true },
    prompt: { type: String, required: true },
    response: { type: String, required: true },
    wasApproved: { type: Boolean },
    approvedBy: { type: String },
  },
  { timestamps: true }
);

export const AIInteraction = mongoose.model<IAIInteraction>("AIInteraction", aiInteractionSchema);
