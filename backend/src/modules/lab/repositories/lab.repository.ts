import { LabOrder } from "../../../models/LabOrder.js";

export class LabRepository {
  async findById(id: string) {
    return LabOrder.findById(id);
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Record<string, unknown>;
    orderBy?: Record<string, unknown>;
  }) {
    let query = LabOrder.find(params.where || {});
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
    return LabOrder.countDocuments(where || {});
  }

  async create(data: Record<string, unknown>) {
    return LabOrder.create(data);
  }

  async update(id: string, data: Record<string, unknown>) {
    return LabOrder.findByIdAndUpdate(id, data, { new: true });
  }
}
