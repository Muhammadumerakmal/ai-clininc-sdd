import { describe, it, expect, vi, beforeEach } from "vitest";
import { NotFoundError } from "../../../../src/shared/errors";

const mockRepo = vi.hoisted(() => ({ create: vi.fn(), findById: vi.fn(), findByPatientId: vi.fn(), findMany: vi.fn(), count: vi.fn(), update: vi.fn() }));

vi.mock("../../../../src/modules/medical-record/repositories/medical-record.repository", () => ({
  MedicalRecordRepository: vi.fn(() => mockRepo),
}));

vi.mock("../../../../src/models/Appointment", () => ({
  Appointment: { findByIdAndUpdate: vi.fn() },
}));

vi.mock("../../../../src/config/logger", () => ({ logger: { info: vi.fn() } }));

import { MedicalRecordService } from "../../../../src/modules/medical-record/services/medical-record.service";
import { Appointment } from "../../../../src/models/Appointment";

describe("MedicalRecordService", () => {
  let service: MedicalRecordService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new MedicalRecordService();
  });

  describe("create", () => {
    const data = { patientId: "p1", doctorId: "d1", consultationNotes: "Patient presents with fever" };

    it("should create a medical record", async () => {
      mockRepo.create.mockResolvedValue({ id: "r1", ...data });
      const result = await service.create(data);
      expect(result.id).toBe("r1");
    });

    it("should mark appointment as Completed if appointmentId provided", async () => {
      mockRepo.create.mockResolvedValue({ id: "r1" });
      await service.create({ ...data, appointmentId: "a1" });
      expect(Appointment.findByIdAndUpdate).toHaveBeenCalledWith("a1", { status: "Completed" });
    });
  });

  describe("findById", () => {
    it("should return record if found", async () => {
      mockRepo.findById.mockResolvedValue({ id: "r1" });
      const result = await service.findById("r1");
      expect(result.id).toBe("r1");
    });

    it("should throw NotFoundError if not found", async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.findById("r1")).rejects.toThrow(NotFoundError);
    });
  });

  describe("findByPatientId", () => {
    it("should return records for patient", async () => {
      mockRepo.findByPatientId.mockResolvedValue([{ id: "r1" }]);
      const result = await service.findByPatientId("p1");
      expect(result).toHaveLength(1);
    });
  });

  describe("list", () => {
    it("should return paginated records", async () => {
      mockRepo.findMany.mockResolvedValue([{ id: "r1" }]);
      mockRepo.count.mockResolvedValue(1);
      const result = await service.list({ page: 1, limit: 10 });
      expect(result.records).toHaveLength(1);
    });
  });

  describe("update", () => {
    it("should update record if exists", async () => {
      mockRepo.findById.mockResolvedValue({ id: "r1" });
      mockRepo.update.mockResolvedValue({ id: "r1", diagnosis: "Flu" });
      const result = await service.update("r1", { diagnosis: "Flu" });
      expect(result.diagnosis).toBe("Flu");
    });

    it("should throw NotFoundError if not found", async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.update("r1", {})).rejects.toThrow(NotFoundError);
    });
  });
});
