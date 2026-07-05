import { Medicine, Dispensation } from "../../../models/index.js";

export class PharmacyRepository {
  async findMedicineById(id: string) {
    return Medicine.findById(id);
  }

  async findMedicines(params: {
    skip?: number;
    take?: number;
    where?: Record<string, unknown>;
    orderBy?: Record<string, unknown>;
  }) {
    let query = Medicine.find(params.where || {});
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

  async countMedicines(where?: Record<string, unknown>) {
    return Medicine.countDocuments(where || {});
  }

  async createMedicine(data: Record<string, unknown>) {
    return Medicine.create(data);
  }

  async updateMedicine(id: string, data: Record<string, unknown>) {
    return Medicine.findByIdAndUpdate(id, data, { new: true });
  }

  async createDispensation(data: Record<string, unknown>) {
    return Dispensation.create(data);
  }

  async getLowStockMedicines(threshold: number) {
    return Medicine.find({ stockQuantity: { $lte: threshold } }).sort({ stockQuantity: 1 });
  }
}
