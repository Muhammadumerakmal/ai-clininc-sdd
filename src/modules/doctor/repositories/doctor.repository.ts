import { Doctor } from "../../../models/Doctor.js";
import { LeaveRecord } from "../../../models/LeaveRecord.js";

export class DoctorRepository {
  async findById(id: string) {
    return Doctor.findById(id);
  }

  async findByUserId(userId: string) {
    return Doctor.findOne({ userId });
  }

  async findAll(params: { skip?: number; take?: number; where?: Record<string, unknown> }) {
    let query = Doctor.find(params.where || {});
    if (params.skip) query = query.skip(params.skip);
    if (params.take) query = query.limit(params.take);
    return query.sort({ createdAt: -1 });
  }

  async count(where?: Record<string, unknown>) {
    return Doctor.countDocuments(where || {});
  }

  async create(data: Record<string, unknown>) {
    return Doctor.create(data);
  }

  async update(id: string, data: Record<string, unknown>) {
    return Doctor.findByIdAndUpdate(id, data, { new: true });
  }

  async createLeave(data: Record<string, unknown>) {
    return LeaveRecord.create(data);
  }

  async findLeaves(doctorId: string) {
    return LeaveRecord.find({ doctorId }).sort({ startDate: -1 });
  }

  async updateLeave(id: string, data: Record<string, unknown>) {
    return LeaveRecord.findByIdAndUpdate(id, data, { new: true });
  }
}
