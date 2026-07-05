import { DoctorRepository } from "../repositories/doctor.repository.js";
import { NotFoundError } from "../../../shared/errors.js";
import { logger } from "../../../config/logger.js";

const repo = new DoctorRepository();

export class DoctorService {
  async create(data: {
    userId: string;
    specialization: string;
    qualifications?: Record<string, unknown>[];
    schedule?: Record<string, unknown>;
  }) {
    const existing = await repo.findByUserId(data.userId);
    if (existing) throw new NotFoundError("Doctor profile already exists for this user");

    const doctor = await repo.create(data);
    logger.info({ event: "doctor_created", doctorId: doctor.id, userId: data.userId });
    return doctor;
  }

  async findById(id: string) {
    const doctor = await repo.findById(id);
    if (!doctor) throw new NotFoundError("Doctor not found");
    return doctor;
  }

  async list(params: { page: number; limit: number; specialization?: string }) {
    const where: Record<string, unknown> = {};
    if (params.specialization) where.specialization = params.specialization;

    const [doctors, total] = await Promise.all([
      repo.findAll({ skip: (params.page - 1) * params.limit, take: params.limit, where }),
      repo.count(where),
    ]);
    return { doctors, pagination: { page: params.page, limit: params.limit, total, totalPages: Math.ceil(total / params.limit) } };
  }

  async update(id: string, data: Record<string, unknown>) {
    const existing = await repo.findById(id);
    if (!existing) throw new NotFoundError("Doctor not found");
    const doctor = await repo.update(id, data);
    logger.info({ event: "doctor_updated", doctorId: id });
    return doctor;
  }

  async requestLeave(data: { doctorId: string; startDate: Date; endDate: Date; reason: string }) {
    const leave = await repo.createLeave(data);
    logger.info({ event: "leave_requested", doctorId: data.doctorId, leaveId: leave.id });
    return leave;
  }

  async getLeaves(doctorId: string) {
    return repo.findLeaves(doctorId);
  }

  async updateLeave(id: string, data: { status?: string; reason?: string }) {
    return repo.updateLeave(id, data);
  }
}
