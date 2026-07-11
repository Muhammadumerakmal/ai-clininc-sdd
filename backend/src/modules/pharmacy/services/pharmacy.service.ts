import { PharmacyRepository } from "../repositories/pharmacy.repository.js";
import { NotFoundError, ValidationError } from "../../../shared/errors.js";
import { logger } from "../../../config/logger.js";

const repo = new PharmacyRepository();

export class PharmacyService {
  async createMedicine(data: {
    name: string;
    genericName: string;
    category: string;
    unit: string;
    price: number;
    stockQuantity?: number;
    minStockLevel: number;
  }) {
    const medicine = await repo.createMedicine(data);
    logger.info({ event: "medicine_created", medicineId: medicine.id });
    return medicine;
  }

  async updateMedicine(id: string, data: Record<string, unknown>) {
    const existing = await repo.findMedicineById(id);
    if (!existing) throw new NotFoundError("Medicine not found");
    const medicine = await repo.updateMedicine(id, data);
    logger.info({ event: "medicine_updated", medicineId: id });
    return medicine;
  }

  async listMedicines(params: { page: number; limit: number; category?: string; search?: string }) {
    const where: Record<string, unknown> = { isActive: true };
    if (params.category) where.category = params.category;
    if (params.search) {
      where.$or = [
        { name: { $regex: params.search, $options: "i" } },
        { genericName: { $regex: params.search, $options: "i" } },
      ];
    }

    const [medicines, total] = await Promise.all([
      repo.findMedicines({
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        where,
        orderBy: { name: "asc" },
      }),
      repo.countMedicines(where),
    ]);

    return {
      medicines,
      pagination: { page: params.page, limit: params.limit, total, totalPages: Math.ceil(total / params.limit) },
    };
  }

  async getLowStock() {
    return repo.getLowStockMedicines(10);
  }

  async dispense(data: {
    prescriptionId: string;
    medicineId: string;
    quantity: number;
    pharmacistId: string;
    notes?: string;
  }) {
    const medicine = await repo.findMedicineById(data.medicineId);
    if (!medicine) throw new NotFoundError("Medicine not found");

    if (medicine.stockQuantity < data.quantity) {
      throw new ValidationError(`Insufficient stock. Available: ${medicine.stockQuantity}`);
    }

    const dispensation = await repo.createDispensation({
      prescriptionId: data.prescriptionId,
      medicineId: data.medicineId,
      quantity: data.quantity,
      pharmacistId: data.pharmacistId,
      notes: data.notes,
    });

    await repo.updateMedicine(data.medicineId, {
      stockQuantity: medicine.stockQuantity - data.quantity,
    });

    logger.info({ event: "medicine_dispensed", dispensationId: dispensation.id, medicineId: data.medicineId, quantity: data.quantity });
    return dispensation;
  }
}
