import { Prisma } from "@prisma/client";
import { PrescriptionRepository } from "../repositories/prescription.repository.js";
import { NotFoundError, ForbiddenError } from "../../../shared/errors.js";
import { logger } from "../../../config/logger.js";

const repo = new PrescriptionRepository();

export class PrescriptionService {
  async create(data: {
    patientId: string;
    doctorId: string;
    appointmentId?: string;
    medications: Prisma.InputJsonValue;
    notes?: string;
    isAIGenerated?: boolean;
    requiresDoctorApproval?: boolean;
  }) {
    const prescription = await repo.create({
      patient: { connect: { id: data.patientId } },
      doctor: { connect: { id: data.doctorId } },
      appointment: data.appointmentId ? { connect: { id: data.appointmentId } } : undefined,
      medications: data.medications as Prisma.InputJsonValue,
      notes: data.notes,
      isAIGenerated: data.isAIGenerated ?? false,
      requiresDoctorApproval: data.requiresDoctorApproval ?? true,
    });

    logger.info({ event: "prescription_created", prescriptionId: prescription.id, isAIGenerated: data.isAIGenerated });
    return prescription;
  }

  async findById(id: string) {
    const prescription = await repo.findById(id);
    if (!prescription) throw new NotFoundError("Prescription not found");
    return prescription;
  }

  async findByPatientId(patientId: string) {
    return repo.findByPatientId(patientId);
  }

  async list(params: { page: number; limit: number; patientId?: string; doctorId?: string }) {
    const where: Record<string, unknown> = {};
    if (params.patientId) where.patientId = params.patientId;
    if (params.doctorId) where.doctorId = params.doctorId;

    const [prescriptions, total] = await Promise.all([
      repo.findMany({
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        where: where as any,
        orderBy: { createdAt: "desc" },
      }),
      repo.count(where as any),
    ]);

    return {
      prescriptions,
      pagination: { page: params.page, limit: params.limit, total, totalPages: Math.ceil(total / params.limit) },
    };
  }

  async approvePrescription(id: string, approved: boolean) {
    const existing = await repo.findById(id);
    if (!existing) throw new NotFoundError("Prescription not found");

    if (!existing.requiresDoctorApproval) {
      throw new ForbiddenError("Prescription does not require approval");
    }

    if (existing.approvedAt) {
      throw new ForbiddenError("Prescription already processed");
    }

    const prescription = await repo.update(id, {
      requiresDoctorApproval: false,
      approvedAt: approved ? new Date() : null,
    });

    logger.info({ event: "prescription_approved", prescriptionId: id, approved });
    return prescription;
  }

  async update(id: string, data: Record<string, unknown>) {
    const existing = await repo.findById(id);
    if (!existing) throw new NotFoundError("Prescription not found");
    const prescription = await repo.update(id, data);
    logger.info({ event: "prescription_updated", prescriptionId: id });
    return prescription;
  }
}
