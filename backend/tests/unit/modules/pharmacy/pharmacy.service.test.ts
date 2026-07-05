import { describe, it, expect, vi, beforeEach } from "vitest";
import { NotFoundError, ValidationError } from "../../../../src/shared/errors";

const mockRepo = vi.hoisted(() => ({ createMedicine: vi.fn(), findMedicineById: vi.fn(), updateMedicine: vi.fn(), findMedicines: vi.fn(), countMedicines: vi.fn(), getLowStockMedicines: vi.fn(), createDispensation: vi.fn() }));

vi.mock("../../../../src/modules/pharmacy/repositories/pharmacy.repository", () => ({
  PharmacyRepository: vi.fn(() => mockRepo),
}));

vi.mock("../../../../src/config/logger", () => ({ logger: { info: vi.fn() } }));

import { PharmacyService } from "../../../../src/modules/pharmacy/services/pharmacy.service";

describe("PharmacyService", () => {
  let service: PharmacyService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new PharmacyService();
  });

  describe("createMedicine", () => {
    const data = { name: "Amoxicillin", genericName: "Amoxicillin", category: "Antibiotic", unit: "capsule", price: 10.99, minStockLevel: 50 };

    it("should create a medicine", async () => {
      mockRepo.createMedicine.mockResolvedValue({ id: "m1", ...data });
      const result = await service.createMedicine(data);
      expect(result.id).toBe("m1");
    });
  });

  describe("updateMedicine", () => {
    it("should update medicine if exists", async () => {
      mockRepo.findMedicineById.mockResolvedValue({ id: "m1" });
      mockRepo.updateMedicine.mockResolvedValue({ id: "m1", price: 12.99 });
      const result = await service.updateMedicine("m1", { price: 12.99 });
      expect(result.price).toBe(12.99);
    });

    it("should throw NotFoundError if not found", async () => {
      mockRepo.findMedicineById.mockResolvedValue(null);
      await expect(service.updateMedicine("m1", {})).rejects.toThrow(NotFoundError);
    });
  });

  describe("listMedicines", () => {
    it("should return paginated medicines", async () => {
      mockRepo.findMedicines.mockResolvedValue([{ id: "m1" }]);
      mockRepo.countMedicines.mockResolvedValue(1);
      const result = await service.listMedicines({ page: 1, limit: 20 });
      expect(result.medicines).toHaveLength(1);
    });

    it("should filter by category", async () => {
      mockRepo.findMedicines.mockResolvedValue([]);
      mockRepo.countMedicines.mockResolvedValue(0);
      await service.listMedicines({ page: 1, limit: 20, category: "Antibiotic" });
      expect(mockRepo.findMedicines).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({ isActive: true, category: "Antibiotic" }),
      }));
    });
  });

  describe("getLowStock", () => {
    it("should return low stock medicines", async () => {
      mockRepo.getLowStockMedicines.mockResolvedValue([{ id: "m1", stockQuantity: 5 }]);
      const result = await service.getLowStock();
      expect(result).toHaveLength(1);
    });
  });

  describe("dispense", () => {
    const data = { prescriptionId: "rx1", medicineId: "m1", quantity: 10, pharmacistId: "ph1" };

    it("should dispense medicine if sufficient stock", async () => {
      mockRepo.findMedicineById.mockResolvedValue({ id: "m1", stockQuantity: 50 });
      mockRepo.createDispensation.mockResolvedValue({ id: "disp1" });
      mockRepo.updateMedicine.mockResolvedValue({ id: "m1", stockQuantity: 40 });
      const result = await service.dispense(data);
      expect(result.id).toBe("disp1");
      expect(mockRepo.updateMedicine).toHaveBeenCalledWith("m1", { stockQuantity: 40 });
    });

    it("should throw NotFoundError if medicine not found", async () => {
      mockRepo.findMedicineById.mockResolvedValue(null);
      await expect(service.dispense(data)).rejects.toThrow(NotFoundError);
    });

    it("should throw ValidationError if insufficient stock", async () => {
      mockRepo.findMedicineById.mockResolvedValue({ id: "m1", stockQuantity: 5 });
      await expect(service.dispense(data)).rejects.toThrow(ValidationError);
    });
  });
});
