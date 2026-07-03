import { describe, it, expect, vi, beforeEach } from "vitest";

const mockRepo = vi.hoisted(() => ({ getDashboardStats: vi.fn(), getRevenueReport: vi.fn(), getAppointmentReport: vi.fn() }));

vi.mock("../../../../src/modules/reports/repositories/report.repository", () => ({
  ReportRepository: vi.fn(() => mockRepo),
}));

import { ReportService } from "../../../../src/modules/reports/services/report.service";

describe("ReportService", () => {
  let service: ReportService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new ReportService();
  });

  describe("getDashboard", () => {
    it("should return dashboard stats", async () => {
      const mockStats = { totalPatients: 100, totalDoctors: 10, totalAppointments: 50, totalRevenue: 50000 };
      mockRepo.getDashboardStats.mockResolvedValue(mockStats);
      const result = await service.getDashboard();
      expect(result.totalPatients).toBe(100);
    });

    it("should pass clinicId if provided", async () => {
      mockRepo.getDashboardStats.mockResolvedValue({});
      await service.getDashboard("c1");
      expect(mockRepo.getDashboardStats).toHaveBeenCalledWith("c1");
    });
  });

  describe("getRevenue", () => {
    it("should return revenue report", async () => {
      mockRepo.getRevenueReport.mockResolvedValue({ total: 10000 });
      const result = await service.getRevenue("c1", "2026-01-01", "2026-12-31");
      expect(result.total).toBe(10000);
    });
  });

  describe("getAppointments", () => {
    it("should return appointment report", async () => {
      mockRepo.getAppointmentReport.mockResolvedValue({ total: 200 });
      const result = await service.getAppointments("c1", "2026-01-01", "2026-12-31");
      expect(result.total).toBe(200);
    });
  });
});
