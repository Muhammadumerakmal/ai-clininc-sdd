import { PatientRepository } from "../repositories/patient.repository.js";
import { NotFoundError } from "../../../shared/errors.js";
import { logger } from "../../../config/logger.js";

const patientRepo = new PatientRepository();

export class PatientService {
  async create(data: {
    clinicId: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: string;
    phone: string;
    email?: string;
    address?: string;
    bloodGroup?: string;
    medicalHistory?: Record<string, unknown>[];
    allergies?: string[];
    emergencyContact?: Record<string, unknown>;
    insuranceDetails?: Record<string, unknown>;
  }) {
    const patient = await patientRepo.create({
      clinicId: data.clinicId,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      phone: data.phone,
      email: data.email,
      address: data.address,
      bloodGroup: data.bloodGroup,
      medicalHistory: data.medicalHistory ?? [],
      allergies: data.allergies ?? [],
      emergencyContact: data.emergencyContact,
      insuranceDetails: data.insuranceDetails,
    });

    logger.info({ event: "patient_created", patientId: patient.id, clinicId: data.clinicId });
    return patient;
  }

  async findById(id: string) {
    const patient = await patientRepo.findById(id);
    if (!patient) throw new NotFoundError("Patient not found");
    return patient;
  }

  async update(id: string, data: Record<string, unknown>) {
    const existing = await patientRepo.findById(id);
    if (!existing) throw new NotFoundError("Patient not found");
    const patient = await patientRepo.update(id, data);
    logger.info({ event: "patient_updated", patientId: id });
    return patient;
  }

  async list(params: { page: number; limit: number; search?: string; clinicId?: string }) {
    const where: Record<string, unknown> = {};
    if (params.clinicId) where.clinicId = params.clinicId;
    if (params.search) {
      where.$or = [
        { firstName: { $regex: params.search, $options: "i" } },
        { lastName: { $regex: params.search, $options: "i" } },
        { phone: { $regex: params.search } },
      ];
    }

    const [patients, total] = await Promise.all([
      patientRepo.findMany({
        skip: (params.page - 1) * params.limit,
        take: params.limit,
        where,
        orderBy: { createdAt: "desc" },
      }),
      patientRepo.count(where),
    ]);

    return {
      patients,
      pagination: { page: params.page, limit: params.limit, total, totalPages: Math.ceil(total / params.limit) },
    };
  }

  async search(query: string, clinicId?: string) {
    return patientRepo.search(query, clinicId);
  }
}
