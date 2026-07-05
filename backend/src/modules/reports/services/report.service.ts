import { ReportRepository } from "../repositories/report.repository.js";

const repo = new ReportRepository();

export class ReportService {
  async getDashboard(clinicId?: string) {
    return repo.getDashboardStats(clinicId);
  }

  async getRevenue(clinicId: string, from: string, to: string) {
    return repo.getRevenueReport(clinicId, new Date(from), new Date(to));
  }

  async getAppointments(clinicId: string, from: string, to: string) {
    return repo.getAppointmentReport(clinicId, new Date(from), new Date(to));
  }
}
