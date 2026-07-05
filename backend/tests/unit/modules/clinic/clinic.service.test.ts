import { describe, it, expect, vi, beforeEach } from "vitest";
import { NotFoundError } from "../../../../src/shared/errors";

const mockRepo = vi.hoisted(() => ({ create: vi.fn(), findById: vi.fn(), findAll: vi.fn(), update: vi.fn(), createDepartment: vi.fn(), getDepartments: vi.fn(), updateDepartment: vi.fn() }));

vi.mock("../../../../src/modules/clinic/repositories/clinic.repository", () => ({
  ClinicRepository: vi.fn(() => mockRepo),
}));

vi.mock("../../../../src/config/logger", () => ({ logger: { info: vi.fn() } }));

import { ClinicService } from "../../../../src/modules/clinic/services/clinic.service";

describe("ClinicService", () => {
  let service: ClinicService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ClinicService();
  });

  describe("create", () => {
    const data = { name: "Main Clinic", address: "123 Street", phone: "555-0100", email: "clinic@test.com" };

    it("should create a clinic", async () => {
      mockRepo.create.mockResolvedValue({ id: "c1", ...data });
      const result = await service.create(data);
      expect(result.id).toBe("c1");
    });
  });

  describe("findById", () => {
    it("should return clinic if found", async () => {
      mockRepo.findById.mockResolvedValue({ id: "c1" });
      const result = await service.findById("c1");
      expect(result.id).toBe("c1");
    });

    it("should throw NotFoundError if not found", async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.findById("c1")).rejects.toThrow(NotFoundError);
    });
  });

  describe("findAll", () => {
    it("should return all clinics", async () => {
      mockRepo.findAll.mockResolvedValue([{ id: "c1" }, { id: "c2" }]);
      const result = await service.findAll();
      expect(result).toHaveLength(2);
    });
  });

  describe("update", () => {
    it("should update clinic if exists", async () => {
      mockRepo.update.mockResolvedValue({ id: "c1", name: "Updated" });
      const result = await service.update("c1", { name: "Updated" });
      expect(result.name).toBe("Updated");
    });

    it("should throw NotFoundError if clinic not found", async () => {
      mockRepo.update.mockResolvedValue(null);
      await expect(service.update("c1", {})).rejects.toThrow(NotFoundError);
    });
  });

  describe("createDepartment", () => {
    it("should create a department", async () => {
      mockRepo.createDepartment.mockResolvedValue({ id: "d1", name: "Cardiology" });
      const result = await service.createDepartment({ name: "Cardiology", clinicId: "c1" });
      expect(result.id).toBe("d1");
    });
  });

  describe("getDepartments", () => {
    it("should return departments for clinic", async () => {
      mockRepo.getDepartments.mockResolvedValue([{ id: "d1" }]);
      const result = await service.getDepartments("c1");
      expect(result).toHaveLength(1);
    });
  });

  describe("updateDepartment", () => {
    it("should update department", async () => {
      mockRepo.updateDepartment.mockResolvedValue({ id: "d1", name: "Neuro" });
      const result = await service.updateDepartment("d1", { name: "Neuro" });
      expect(result.name).toBe("Neuro");
    });
  });
});
