import { MedicalRecordRepository } from "../repositories/medical-record.repository.js";
import { Appointment } from "../../../models/Appointment.js";
import { NotFoundError } from "../../../shared/errors.js";
import { logger } from "../../../config/logger.js";

const repo = new MedicalRecordRepository();

export class MedicalRecordService {
  async create(data: {
    patientId: string;
    doctorId: string;
    appointmentId?: string;
    consultationNotes: string;
    diagnosis?: string;
    treatmentPlan?: string;
    vitals?: Record<string, unknown>;
    attachments?: Record<string, unknown>[];
    aiSummary?: string;
  }) {
    const record = await repo.create({
      patientId: data.patientId,
      doctorId: data.doctorId,
      appointmentId: data.appointmentId,
      consultationNotes: data.consultationNotes,
      diagnosis: data.diagnosis,
      treatmentPlan: data.treatmentPlan,
      vitals: data.vitals,
      attachments: data.attachments ?? [],
      aiSummary: data.aiSummary,
    });

    if (data.appointmentId) {
      await Appointment.findByIdAndUpdate(data.appointmentId, { status: "Completed" });
    }

    logger.info({ event: "medical_record_created", recordId: record.id, patientId: data.patientId });
    return record;
  }

  async findById(id: string) {
    const record = await repo.findById(id);
    if (!record) throw new NotFoundError("Medical record not found");
    return record;
  }

  async findByPatientId(patientId: string) {
    return repo.findByPatientId(patientId);
  }

  async list(params: { page: number; limit: number; patientId?: string; doctorId?: string }) {
    const where: Record<string, unknown> = {};
    if (params.patientId) where.patientId = params.patientId;
    if (params.doctorId) where.doctorId = params.doctorId;

    const [records, total] = await Promise.all([
      repo.findMany({
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        where,
        orderBy: { createdAt: "desc" },
      }),
      repo.count(where),
    ]);

    return {
      records,
      pagination: {
        page: params.page,
        limit: params.limit,
        total,
        totalPages: Math.ceil(total / params.limit),
      },
    };
  }

  async update(id: string, data: Record<string, unknown>) {
    const existing = await repo.findById(id);
    if (!existing) throw new NotFoundError("Medical record not found");
    const record = await repo.update(id, data);
    logger.info({ event: "medical_record_updated", recordId: id });
    return record;
  }
}
