import { Prescription } from "../../../models/Prescription.js";

export class PrescriptionRepository {
  async findById(id: string) {
    return Prescription.findById(id);
  }

  async findByPatientId(patientId: string) {
    return Prescription.find({ patientId }).sort({ createdAt: -1 });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Record<string, unknown>;
    orderBy?: Record<string, unknown>;
  }) {
    let query = Prescription.find(params.where || {});
    if (params.skip) query = query.skip(params.skip);
    if (params.take) query = query.limit(params.take);
    if (params.orderBy) {
      const sort: Record<string, 1 | -1> = {};
      for (const [key, val] of Object.entries(params.orderBy)) {
        sort[key] = val === "desc" ? -1 : 1;
      }
      query = query.sort(sort);
    }
    return query;
  }

  async count(where?: Record<string, unknown>) {
    return Prescription.countDocuments(where || {});
  }

  async create(data: Record<string, unknown>) {
    return Prescription.create(data);
  }

  async update(id: string, data: Record<string, unknown>) {
    return Prescription.findByIdAndUpdate(id, data, { new: true });
  }
}
