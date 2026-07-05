import { AppointmentRepository } from "../repositories/appointment.repository.js";
import { NotFoundError, ConflictError } from "../../../shared/errors.js";
import { logger } from "../../../config/logger.js";

const appointmentRepo = new AppointmentRepository();

const APPOINTMENT_DURATION_MINUTES = 30;

export class AppointmentService {
  async create(data: {
    patientId: string;
    doctorId: string;
    clinicId: string;
    dateTime: Date;
    reason?: string;
    notes?: string;
  }) {
    const endTime = new Date(data.dateTime.getTime() + APPOINTMENT_DURATION_MINUTES * 60 * 1000);

    const overlapping = await appointmentRepo.findOverlapping(data.doctorId, data.dateTime, endTime);
    if (overlapping) {
      throw new ConflictError("Doctor already has an appointment at this time");
    }

    const appointment = await appointmentRepo.create({
      patient: { connect: { id: data.patientId } },
      doctor: { connect: { id: data.doctorId } },
      clinic: { connect: { id: data.clinicId } },
      dateTime: data.dateTime,
      endTime,
      reason: data.reason,
      notes: data.notes,
    });

    logger.info({ event: "appointment_created", appointmentId: appointment.id });
    return appointment;
  }

  async findById(id: string) {
    const appointment = await appointmentRepo.findById(id);
    if (!appointment) throw new NotFoundError("Appointment not found");
    return appointment;
  }

  async update(id: string, data: {
    dateTime?: Date;
    reason?: string;
    notes?: string;
    status?: string;
  }) {
    const existing = await appointmentRepo.findById(id);
    if (!existing) throw new NotFoundError("Appointment not found");

    const updateData: Record<string, unknown> = {};
    if (data.dateTime) {
      const endTime = new Date(data.dateTime.getTime() + APPOINTMENT_DURATION_MINUTES * 60 * 1000);
      updateData.dateTime = data.dateTime;
      updateData.endTime = endTime;

      const overlapping = await appointmentRepo.findOverlapping(existing.doctorId, data.dateTime, endTime, id);
      if (overlapping) {
        throw new ConflictError("Doctor already has an appointment at this time");
      }
    }
    if (data.reason) updateData.reason = data.reason;
    if (data.notes) updateData.notes = data.notes;
    if (data.status) updateData.status = data.status;

    const appointment = await appointmentRepo.update(id, updateData);
    logger.info({ event: "appointment_updated", appointmentId: id, status: data.status });
    return appointment;
  }

  async cancel(id: string) {
    const existing = await appointmentRepo.findById(id);
    if (!existing) throw new NotFoundError("Appointment not found");

    const appointment = await appointmentRepo.update(id, { status: "Cancelled" });
    logger.info({ event: "appointment_cancelled", appointmentId: id });
    return appointment;
  }

  async list(params: {
    page: number;
    limit: number;
    status?: string;
    doctorId?: string;
    patientId?: string;
    clinicId?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }) {
    const where: Record<string, unknown> = {};

    if (params.status) where.status = params.status;
    if (params.doctorId) where.doctorId = params.doctorId;
    if (params.patientId) where.patientId = params.patientId;
    if (params.clinicId) where.clinicId = params.clinicId;
    if (params.dateFrom || params.dateTo) {
      const dateFilter: Record<string, Date> = {};
      if (params.dateFrom) dateFilter.gte = params.dateFrom;
      if (params.dateTo) dateFilter.lte = params.dateTo;
      where.dateTime = dateFilter;
    }

    const [appointments, total] = await Promise.all([
      appointmentRepo.findMany({
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        where,
        orderBy: { dateTime: "desc" },
      }),
      appointmentRepo.count(where),
    ]);

    return {
      appointments,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.ceil(total / params.limit),
      },
    };
  }

  async getQueue(clinicId: string, date: Date) {
    return appointmentRepo.getQueue(clinicId, date);
  }

  async getPatientAppointments(patientId: string) {
    return appointmentRepo.getAppointmentsForPatient(patientId);
  }
}
