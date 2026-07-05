import { describe, it, expect, vi, beforeEach } from "vitest";
import { NotFoundError } from "../../../../src/shared/errors";

const mockRepo = vi.hoisted(() => ({ create: vi.fn(), findById: vi.fn(), update: vi.fn(), findMany: vi.fn(), count: vi.fn(), search: vi.fn() }));

vi.mock("../../../../src/modules/patient/repositories/patient.repository", () => ({
  PatientRepository: vi.fn(() => mockRepo),
}));

vi.mock("../../../../src/config/logger", () => ({ logger: { info: vi.fn() } }));

import { PatientService } from "../../../../src/modules/patient/services/patient.service";

describe("PatientService", () => {
  let service: PatientService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new PatientService();
  });

  describe("create", () => {
    const data = { clinicId: "c1", firstName: "John", lastName: "Doe", dateOfBirth: new Date("1990-01-01"), gender: "Male", phone: "1234567890" };

    it("should create a patient", async () => {
      mockRepo.create.mockResolvedValue({ id: "p1", ...data });
      const result = await service.create(data);
      expect(result.id).toBe("p1");
      expect(mockRepo.create).toHaveBeenCalledOnce();
    });

    it("should set default empty arrays for medicalHistory and allergies", async () => {
      mockRepo.create.mockResolvedValue({ id: "p1" });
      await service.create(data);
      expect(mockRepo.create).toHaveBeenCalledWith(expect.objectContaining({ medicalHistory: [], allergies: [] }));
    });
  });

  describe("findById", () => {
    it("should return patient if found", async () => {
      mockRepo.findById.mockResolvedValue({ id: "p1", firstName: "John" });
      const result = await service.findById("p1");
      expect(result).toEqual({ id: "p1", firstName: "John" });
    });

    it("should throw NotFoundError if not found", async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.findById("p1")).rejects.toThrow(NotFoundError);
    });
  });

  describe("update", () => {
    it("should update patient if exists", async () => {
      mockRepo.findById.mockResolvedValue({ id: "p1" });
      mockRepo.update.mockResolvedValue({ id: "p1", phone: "999" });
      const result = await service.update("p1", { phone: "999" });
      expect(result.phone).toBe("999");
    });

    it("should throw NotFoundError if patient does not exist", async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.update("p1", {})).rejects.toThrow(NotFoundError);
    });
  });

  describe("list", () => {
    it("should return paginated patients", async () => {
      mockRepo.findMany.mockResolvedValue([{ id: "p1" }, { id: "p2" }]);
      mockRepo.count.mockResolvedValue(2);
      const result = await service.list({ page: 1, limit: 10 });
      expect(result.patients).toHaveLength(2);
      expect(result.pagination.totalPages).toBe(1);
    });
  });

  describe("search", () => {
    it("should call repo.search with query", async () => {
      mockRepo.search.mockResolvedValue([{ id: "p1" }]);
      const result = await service.search("John", "c1");
      expect(mockRepo.search).toHaveBeenCalledWith("John", "c1");
      expect(result).toHaveLength(1);
    });
  });
});
