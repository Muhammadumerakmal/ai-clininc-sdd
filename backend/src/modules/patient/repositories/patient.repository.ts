import { Patient } from "../../../models/Patient.js";

export class PatientRepository {
  async findById(id: string) {
    return Patient.findById(id);
  }

  async findByUserId(userId: string) {
    return Patient.findOne({ userId });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Record<string, unknown>;
    orderBy?: Record<string, unknown>;
  }) {
    let query = Patient.find(params.where || {});
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
    return Patient.countDocuments(where || {});
  }

  async create(data: Record<string, unknown>) {
    return Patient.create(data);
  }

  async update(id: string, data: Record<string, unknown>) {
    return Patient.findByIdAndUpdate(id, data, { new: true });
  }

  async search(query: string, clinicId?: string) {
    const filter: Record<string, unknown> = {
      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
        { phone: { $regex: query } },
        { email: { $regex: query, $options: "i" } },
      ],
    };
    if (clinicId) filter.clinicId = clinicId;
    return Patient.find(filter).sort({ createdAt: -1 }).limit(20);
  }
}
