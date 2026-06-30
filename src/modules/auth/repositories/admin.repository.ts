import { User } from "../../../models/User.js";

export class AdminRepository {
  async findMany(params: {
    skip: number;
    limit: number;
    where?: Record<string, unknown>;
  }) {
    return User.find(params.where || {})
      .skip(params.skip)
      .limit(params.limit)
      .sort({ createdAt: -1 })
      .select("id email name role isVerified isActive createdAt");
  }

  async count(where?: Record<string, unknown>) {
    return User.countDocuments(where || {});
  }

  async findById(id: string) {
    return User.findById(id).select("id email name role isVerified isActive clinicId createdAt updatedAt");
  }

  async create(data: Record<string, unknown>) {
    return User.create(data);
  }

  async update(id: string, data: Record<string, unknown>) {
    return User.findByIdAndUpdate(id, data, { new: true }).select("id email name role isActive");
  }

  async deactivate(id: string) {
    await User.findByIdAndUpdate(id, { isActive: false });
  }
}
