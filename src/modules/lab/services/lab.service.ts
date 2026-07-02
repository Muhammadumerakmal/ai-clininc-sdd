import { LabRepository } from "../repositories/lab.repository.js";
import { NotFoundError } from "../../../shared/errors.js";
import { logger } from "../../../config/logger.js";

const repo = new LabRepository();

export class LabService {
  async create(data: {
    patientId: string;
    doctorId: string;
    medicalRecordId?: string;
    testName: string;
    instructions?: string;
  }) {
    const labOrder = await repo.create({
      patient: { connect: { id: data.patientId } },
      doctor: { connect: { id: data.doctorId } },
      medicalRecord: data.medicalRecordId ? { connect: { id: data.medicalRecordId } } : undefined,
      testName: data.testName,
      instructions: data.instructions,
    });

    logger.info({ event: "lab_order_created", labOrderId: labOrder.id, testName: data.testName });
    return labOrder;
  }

  async findById(id: string) {
    const labOrder = await repo.findById(id);
    if (!labOrder) throw new NotFoundError("Lab order not found");
    return labOrder;
  }

  async list(params: { page: number; limit: number; patientId?: string; status?: string }) {
    const where: Record<string, unknown> = {};
    if (params.patientId) where.patientId = params.patientId;
    if (params.status) where.status = params.status;

    const [labOrders, total] = await Promise.all([
      repo.findMany({
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        where,
        orderBy: { createdAt: "desc" },
      }),
      repo.count(where),
    ]);

    return {
      labOrders,
      pagination: { page: params.page, limit: params.limit, total, totalPages: Math.ceil(total / params.limit) },
    };
  }

  async update(id: string, data: Record<string, unknown>) {
    const existing = await repo.findById(id);
    if (!existing) throw new NotFoundError("Lab order not found");
    const labOrder = await repo.update(id, data);
    logger.info({ event: "lab_order_updated", labOrderId: id });
    return labOrder;
  }

  async review(id: string, reviewedByDoctor: boolean) {
    const existing = await repo.findById(id);
    if (!existing) throw new NotFoundError("Lab order not found");

    const labOrder = await repo.update(id, {
      reviewedByDoctor,
      reviewedAt: reviewedByDoctor ? new Date() : undefined,
    });

    logger.info({ event: "lab_order_reviewed", labOrderId: id, reviewedByDoctor });
    return labOrder;
  }
}
