import { describe, it, expect, vi, beforeEach } from "vitest";
import { NotFoundError, ConflictError } from "../../../../src/shared/errors";

const mockRepo = vi.hoisted(() => ({ create: vi.fn(), findById: vi.fn(), update: vi.fn(), findMany: vi.fn(), count: vi.fn(), findOverlapping: vi.fn(), getQueue: vi.fn(), getAppointmentsForPatient: vi.fn() }));

vi.mock("../../../../src/modules/appointment/repositories/appointment.repository", () => ({
  AppointmentRepository: vi.fn(() => mockRepo),
}));

vi.mock("../../../../src/config/logger", () => ({ logger: { info: vi.fn() } }));

import { AppointmentService } from "../../../../src/modules/appointment/services/appointment.service";

describe("AppointmentService", () => {
  let service: AppointmentService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new AppointmentService();
  });

  describe("create", () => {
    const data = { patientId: "p1", doctorId: "d1", clinicId: "c1", dateTime: new Date("2026-07-04T10:00:00Z") };

    it("should create appointment when no overlap", async () => {
      mockRepo.findOverlapping.mockResolvedValue(null);
      mockRepo.create.mockResolvedValue({ id: "a1", ...data });
      const result = await service.create(data);
      expect(result.id).toBe("a1");
      expect(mockRepo.create).toHaveBeenCalledOnce();
    });

    it("should throw ConflictError if overlapping appointment exists", async () => {
      mockRepo.findOverlapping.mockResolvedValue({ id: "existing" });
      await expect(service.create(data)).rejects.toThrow(ConflictError);
    });
  });

  describe("findById", () => {
    it("should return appointment if found", async () => {
      mockRepo.findById.mockResolvedValue({ id: "a1" });
      const result = await service.findById("a1");
      expect(result.id).toBe("a1");
    });

    it("should throw NotFoundError if not found", async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.findById("a1")).rejects.toThrow(NotFoundError);
    });
  });

  describe("update", () => {
    it("should update appointment fields", async () => {
      mockRepo.findById.mockResolvedValue({ id: "a1", doctorId: "d1" });
      mockRepo.findOverlapping.mockResolvedValue(null);
      mockRepo.update.mockResolvedValue({ id: "a1", status: "Confirmed" });
      const result = await service.update("a1", { status: "Confirmed" });
      expect(result.status).toBe("Confirmed");
    });

    it("should throw NotFoundError if not found", async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.update("a1", {})).rejects.toThrow(NotFoundError);
    });

    it("should check overlap when dateTime changes", async () => {
      const newDate = new Date("2026-07-04T14:00:00Z");
      mockRepo.findById.mockResolvedValue({ id: "a1", doctorId: "d1" });
      mockRepo.findOverlapping.mockResolvedValue(null);
      mockRepo.update.mockResolvedValue({ id: "a1" });
      await service.update("a1", { dateTime: newDate });
      expect(mockRepo.findOverlapping).toHaveBeenCalled();
    });
  });

  describe("cancel", () => {
    it("should set status to Cancelled", async () => {
      mockRepo.findById.mockResolvedValue({ id: "a1" });
      mockRepo.update.mockResolvedValue({ id: "a1", status: "Cancelled" });
      const result = await service.cancel("a1");
      expect(mockRepo.update).toHaveBeenCalledWith("a1", { status: "Cancelled" });
      expect(result.status).toBe("Cancelled");
    });

    it("should throw NotFoundError if not found", async () => {
      mockRepo.findById.mockResolvedValue(null);
      await expect(service.cancel("a1")).rejects.toThrow(NotFoundError);
    });
  });

  describe("list", () => {
    it("should return paginated appointments", async () => {
      mockRepo.findMany.mockResolvedValue([{ id: "a1" }]);
      mockRepo.count.mockResolvedValue(1);
      const result = await service.list({ page: 1, limit: 20 });
      expect(result.appointments).toHaveLength(1);
      expect(result.pagination.totalPages).toBe(1);
    });
  });

  describe("getQueue", () => {
    it("should return queue", async () => {
      mockRepo.getQueue.mockResolvedValue([{ id: "a1" }]);
      const result = await service.getQueue("c1", new Date());
      expect(result).toHaveLength(1);
    });
  });

  describe("getPatientAppointments", () => {
    it("should return patient appointments", async () => {
      mockRepo.getAppointmentsForPatient.mockResolvedValue([{ id: "a1" }]);
      const result = await service.getPatientAppointments("p1");
      expect(result).toHaveLength(1);
    });
  });
});
