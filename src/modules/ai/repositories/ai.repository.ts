import { AIInteraction } from "../../../models/AIInteraction.js";

export class AIRepository {
  async create(data: Record<string, unknown>) { return AIInteraction.create(data); }
  async findByUserId(userId: string, limit: number) { return AIInteraction.find({ userId }).sort({ createdAt: -1 }).limit(limit); }
}
