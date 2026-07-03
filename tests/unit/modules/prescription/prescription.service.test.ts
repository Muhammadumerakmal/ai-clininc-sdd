import { describe, it, expect, vi, beforeEach } from "vitest";
import { NotFoundError, ForbiddenError } from "../../../../src/shared/errors";

const mockRepo = vi.hoisted(() => ({ create: vi.fn(), findById: vi.fn(), findByPatientId: vi.fn(), findMany: vi.fn(), count: vi.fn(), update: vi.fn() }));

vi.mock("../../../../src/modules/prescription/repositories/prescription.repository", () => ({
  PrescriptionRepository: vi.fn(() => mockRepo),
}));

vi.mock("../../../../src/config/logger", () => ({ logger: { info: vi.fn() } }));

import { PrescriptionService } from "../../../../src/modules/prescription/services/prescription.service";

describe("PrescriptionService", () => {
  let service: PrescriptionService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new PrescriptionService();
  });

  describe("create", () => {
    const data = { patientId: "p1", doctorId: "d1", medications: [{ name: "Amoxicillin", dosage: "500mg", frequency: "Twice daily", duration: "7 days" }] };

    it("should create a prescription", async () => {
      mockRepo.create.mockResolvedValue({ id: "rx1", ...data });
      const result = await service.create(data);
      expect(result.id).toBe("rx1");
      expect(mockRepo.create).toHaveBeenCalledOnce();
    });

    it("should default isAIGenerated to false and requiresDoctorApproval to true", async () => {
      mockRepo.create.mockResolvedValue({ id: "rx1" });
      await service.create(data);
      expect(mockRepo.create).toHaveBeenCalledWith(expect.objectContaining({
        isAIGenerated: false,
        requiresDoctorApproval: true,
      }));
    });
  });

  describe("findById", () => {
    it("should return prescription if found", async () => {
      mockRepo.findById.mockResolvedValue({ id: "rx1" });
      const result = await service.findById("rx1");
      expect(result.id).toBe("rx1");
    });

    it("should throw NotFoundError if not found", async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.findById("rx1")).rejects.toThrow(NotFoundError);
    });
  });

  describe("findByPatientId", () => {
    it("should return prescriptions for patient", async () => {
      mockRepo.findByPatientId.mockResolvedValue([{ id: "rx1" }]);
      const result = await service.findByPatientId("p1");
      expect(result).toHaveLength(1);
    });
  });

  describe("list", () => {
    it("should return paginated prescriptions", async () => {
      mockRepo.findMany.mockResolvedValue([{ id: "rx1" }]);
      mockRepo.count.mockResolvedValue(1);
      const result = await service.list({ page: 1, limit: 10 });
      expect(result.prescriptions).toHaveLength(1);
    });
  });

  describe("approvePrescription", () => {
    it("should approve a prescription", async () => {
      mockRepo.findById.mockResolvedValue({ id: "rx1", requiresDoctorApproval: true, approvedAt: null });
      mockRepo.update.mockResolvedValue({ id: "rx1", requiresDoctorApproval: false, approvedAt: new Date() });
      const result = await service.approvePrescription("rx1", true);
      expect(result.requiresDoctorApproval).toBe(false);
    });

    it("should throw NotFoundError if not found", async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.approvePrescription("rx1", true)).rejects.toThrow(NotFoundError);
    });

    it("should throw ForbiddenError if approval not required", async () => {
      mockRepo.findById.mockResolvedValue({ id: "rx1", requiresDoctorApproval: false });
      await expect(service.approvePrescription("rx1", true)).rejects.toThrow(ForbiddenError);
    });

    it("should throw ForbiddenError if already processed", async () => {
      mockRepo.findById.mockResolvedValue({ id: "rx1", requiresDoctorApproval: true, approvedAt: new Date() });
      await expect(service.approvePrescription("rx1", true)).rejects.toThrow(ForbiddenError);
    });
  });

  describe("update", () => {
    it("should update prescription if exists", async () => {
      mockRepo.findById.mockResolvedValue({ id: "rx1" });
      mockRepo.update.mockResolvedValue({ id: "rx1", notes: "Updated" });
      const result = await service.update("rx1", { notes: "Updated" });
      expect(result.notes).toBe("Updated");
    });

    it("should throw NotFoundError if not found", async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.update("rx1", {})).rejects.toThrow(NotFoundError);
    });
  });
});
