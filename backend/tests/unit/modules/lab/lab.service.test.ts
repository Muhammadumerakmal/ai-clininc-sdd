import { describe, it, expect, vi, beforeEach } from "vitest";
import { NotFoundError } from "../../../../src/shared/errors";

const mockRepo = vi.hoisted(() => ({ create: vi.fn(), findById: vi.fn(), findMany: vi.fn(), count: vi.fn(), update: vi.fn() }));

vi.mock("../../../../src/modules/lab/repositories/lab.repository", () => ({
  LabRepository: vi.fn(() => mockRepo),
}));

vi.mock("../../../../src/config/logger", () => ({ logger: { info: vi.fn() } }));

import { LabService } from "../../../../src/modules/lab/services/lab.service";

describe("LabService", () => {
  let service: LabService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new LabService();
  });

  describe("create", () => {
    const data = { patientId: "p1", doctorId: "d1", testName: "Complete Blood Count" };

    it("should create a lab order", async () => {
      mockRepo.create.mockResolvedValue({ id: "l1", ...data });
      const result = await service.create(data);
      expect(result.id).toBe("l1");
    });
  });

  describe("findById", () => {
    it("should return lab order if found", async () => {
      mockRepo.findById.mockResolvedValue({ id: "l1" });
      const result = await service.findById("l1");
      expect(result.id).toBe("l1");
    });

    it("should throw NotFoundError if not found", async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.findById("l1")).rejects.toThrow(NotFoundError);
    });
  });

  describe("list", () => {
    it("should return paginated lab orders", async () => {
      mockRepo.findMany.mockResolvedValue([{ id: "l1" }]);
      mockRepo.count.mockResolvedValue(1);
      const result = await service.list({ page: 1, limit: 10 });
      expect(result.labOrders).toHaveLength(1);
    });

    it("should filter by patientId and status", async () => {
      mockRepo.findMany.mockResolvedValue([]);
      mockRepo.count.mockResolvedValue(0);
      await service.list({ page: 1, limit: 10, patientId: "p1", status: "Ordered" });
      expect(mockRepo.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { patientId: "p1", status: "Ordered" },
      }));
    });
  });

  describe("update", () => {
    it("should update lab order if exists", async () => {
      mockRepo.findById.mockResolvedValue({ id: "l1" });
      mockRepo.update.mockResolvedValue({ id: "l1", status: "Completed", result: "Normal" });
      const result = await service.update("l1", { status: "Completed", result: "Normal" });
      expect(result.status).toBe("Completed");
    });

    it("should throw NotFoundError if not found", async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.update("l1", {})).rejects.toThrow(NotFoundError);
    });
  });

  describe("review", () => {
    it("should mark as reviewed", async () => {
      mockRepo.findById.mockResolvedValue({ id: "l1" });
      mockRepo.update.mockResolvedValue({ id: "l1", reviewedByDoctor: true, reviewedAt: new Date() });
      const result = await service.review("l1", true);
      expect(result.reviewedByDoctor).toBe(true);
    });

    it("should throw NotFoundError if not found", async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.review("l1", true)).rejects.toThrow(NotFoundError);
    });
  });
});
