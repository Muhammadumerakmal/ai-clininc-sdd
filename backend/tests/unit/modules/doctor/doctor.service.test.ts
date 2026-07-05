import { describe, it, expect, vi, beforeEach } from "vitest";
import { NotFoundError } from "../../../../src/shared/errors";

const mockRepo = vi.hoisted(() => ({ create: vi.fn(), findById: vi.fn(), findByUserId: vi.fn(), findAll: vi.fn(), count: vi.fn(), update: vi.fn(), createLeave: vi.fn(), findLeaves: vi.fn(), updateLeave: vi.fn() }));

vi.mock("../../../../src/modules/doctor/repositories/doctor.repository", () => ({
  DoctorRepository: vi.fn(() => mockRepo),
}));

vi.mock("../../../../src/config/logger", () => ({ logger: { info: vi.fn() } }));

import { DoctorService } from "../../../../src/modules/doctor/services/doctor.service";

describe("DoctorService", () => {
  let service: DoctorService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new DoctorService();
  });

  describe("create", () => {
    const data = { userId: "u1", specialization: "Cardiology" };

    it("should create doctor if user does not have profile", async () => {
      mockRepo.findByUserId.mockResolvedValue(null);
      mockRepo.create.mockResolvedValue({ id: "d1", ...data });
      const result = await service.create(data);
      expect(result.id).toBe("d1");
    });

    it("should throw if doctor profile already exists for user", async () => {
      mockRepo.findByUserId.mockResolvedValue({ id: "existing" });
      await expect(service.create(data)).rejects.toThrow("already exists");
    });
  });

  describe("findById", () => {
    it("should return doctor if found", async () => {
      mockRepo.findById.mockResolvedValue({ id: "d1" });
      const result = await service.findById("d1");
      expect(result.id).toBe("d1");
    });

    it("should throw NotFoundError if not found", async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.findById("d1")).rejects.toThrow(NotFoundError);
    });
  });

  describe("list", () => {
    it("should return paginated doctors", async () => {
      mockRepo.findAll.mockResolvedValue([{ id: "d1" }]);
      mockRepo.count.mockResolvedValue(1);
      const result = await service.list({ page: 1, limit: 20 });
      expect(result.doctors).toHaveLength(1);
      expect(result.pagination.totalPages).toBe(1);
    });

    it("should filter by specialization", async () => {
      mockRepo.findAll.mockResolvedValue([]);
      mockRepo.count.mockResolvedValue(0);
      await service.list({ page: 1, limit: 20, specialization: "Cardiology" });
      expect(mockRepo.findAll).toHaveBeenCalledWith(expect.objectContaining({
        where: { specialization: "Cardiology" },
      }));
    });
  });

  describe("update", () => {
    it("should update doctor if exists", async () => {
      mockRepo.findById.mockResolvedValue({ id: "d1" });
      mockRepo.update.mockResolvedValue({ id: "d1", isAvailable: false });
      const result = await service.update("d1", { isAvailable: false });
      expect(result.isAvailable).toBe(false);
    });

    it("should throw NotFoundError if not found", async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.update("d1", {})).rejects.toThrow(NotFoundError);
    });
  });

  describe("requestLeave", () => {
    it("should create leave record", async () => {
      const data = { doctorId: "d1", startDate: new Date("2026-07-10"), endDate: new Date("2026-07-12"), reason: "Vacation" };
      mockRepo.createLeave.mockResolvedValue({ id: "l1", ...data });
      const result = await service.requestLeave(data);
      expect(result.id).toBe("l1");
    });
  });

  describe("getLeaves", () => {
    it("should return leaves for doctor", async () => {
      mockRepo.findLeaves.mockResolvedValue([{ id: "l1" }]);
      const result = await service.getLeaves("d1");
      expect(result).toHaveLength(1);
    });
  });

  describe("updateLeave", () => {
    it("should update leave", async () => {
      mockRepo.updateLeave.mockResolvedValue({ id: "l1", status: "Approved" });
      const result = await service.updateLeave("l1", { status: "Approved" });
      expect(result.status).toBe("Approved");
    });
  });
});
