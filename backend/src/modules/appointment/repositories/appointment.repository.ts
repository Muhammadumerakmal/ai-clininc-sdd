import { Appointment } from "../../../models/Appointment.js";

export class AppointmentRepository {
  async findById(id: string) {
    return Appointment.findById(id).populate("patientId doctorId");
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Record<string, unknown>;
    orderBy?: Record<string, unknown>;
  }) {
    let query = Appointment.find(params.where || {});
    if (params.skip) query = query.skip(params.skip);
    if (params.take) query = query.limit(params.take);
    if (params.orderBy) {
      const sort: Record<string, 1 | -1> = {};
      for (const [key, val] of Object.entries(params.orderBy)) {
        sort[key] = val === "desc" ? -1 : 1;
      }
      query = query.sort(sort);
    }
    return query;
  }

  async count(where?: Record<string, unknown>) {
    return Appointment.countDocuments(where || {});
  }

  async create(data: Record<string, unknown>) {
    return Appointment.create(data);
  }

  async update(id: string, data: Record<string, unknown>) {
    return Appointment.findByIdAndUpdate(id, data, { new: true });
  }

  async findOverlapping(doctorId: string, dateTime: Date, endTime: Date, excludeId?: string) {
    const filter: Record<string, unknown> = {
      doctorId,
      status: { $nin: ["Cancelled"] },
      dateTime: { $lt: endTime },
      endTime: { $gt: dateTime },
    };
    if (excludeId) filter._id = { $ne: excludeId };
    return Appointment.findOne(filter);
  }

  async getQueue(clinicId: string, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return Appointment.find({
      clinicId,
      dateTime: { $gte: startOfDay, $lte: endOfDay },
      status: { $nin: ["Cancelled"] },
    }).sort({ dateTime: 1 });
  }

  async getAppointmentsForPatient(patientId: string) {
    return Appointment.find({ patientId }).sort({ dateTime: -1 });
  }
}
