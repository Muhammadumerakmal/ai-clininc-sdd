import { Patient } from "../../../models/Patient.js";
import { Appointment } from "../../../models/Appointment.js";
import { Invoice } from "../../../models/Invoice.js";
import { Doctor } from "../../../models/Doctor.js";

export class ReportRepository {
  async getDashboardStats(clinicId?: string) {
    const filter = clinicId ? { clinicId } : {};

    const [totalPatients, totalDoctors, totalAppointments, totalInvoices, revenue] = await Promise.all([
      Patient.countDocuments(filter),
      Doctor.countDocuments(),
      Appointment.countDocuments(filter),
      Invoice.countDocuments({ ...filter, isDeleted: false }),
      Invoice.aggregate([
        { $match: { ...filter, status: "Paid", isDeleted: false } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
    ]);

    return {
      totalPatients,
      totalDoctors,
      totalAppointments,
      totalInvoices,
      totalRevenue: revenue[0]?.total || 0,
    };
  }

  async getRevenueReport(clinicId: string, from: Date, to: Date) {
    return Invoice.aggregate([
      { $match: { clinicId, createdAt: { $gte: from, $lte: to }, isDeleted: false } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: { $sum: "$total" },
          count: { $sum: 1 },
          paid: { $sum: { $cond: [{ $eq: ["$status", "Paid"] }, "$total", 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }

  async getAppointmentReport(clinicId: string, from: Date, to: Date) {
    return Appointment.aggregate([
      { $match: { clinicId, dateTime: { $gte: from, $lte: to } } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
  }
}
