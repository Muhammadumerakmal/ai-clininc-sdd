import { ClinicRepository } from "../repositories/clinic.repository.js";
import { NotFoundError } from "../../../shared/errors.js";
import { logger } from "../../../config/logger.js";

const repo = new ClinicRepository();

export class ClinicService {
  async create(data: { name: string; address: string; phone: string; email: string; settings?: any; workingHours?: any }) {
    const clinic = await repo.create(data);
    logger.info({ event: "clinic_created", clinicId: clinic.id });
    return clinic;
  }

  async findById(id: string) {
    const clinic = await repo.findById(id);
    if (!clinic) throw new NotFoundError("Clinic not found");
    return clinic;
  }

  async findAll() { return repo.findAll(); }

  async update(id: string, data: Record<string, unknown>) {
    const clinic = await repo.update(id, data);
    if (!clinic) throw new NotFoundError("Clinic not found");
    logger.info({ event: "clinic_updated", clinicId: id });
    return clinic;
  }

  async createDepartment(data: { name: string; description?: string; clinicId: string }) {
    const dept = await repo.createDepartment(data);
    logger.info({ event: "department_created", departmentId: dept.id, clinicId: data.clinicId });
    return dept;
  }

  async getDepartments(clinicId: string) {
    return repo.getDepartments(clinicId);
  }

  async updateDepartment(id: string, data: Record<string, unknown>) {
    return repo.updateDepartment(id, data);
  }
}
