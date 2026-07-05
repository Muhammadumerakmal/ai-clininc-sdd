import { Clinic } from "../../../models/Clinic.js";
import { Department } from "../../../models/Department.js";

export class ClinicRepository {
  async findById(id: string) { return Clinic.findById(id); }
  async findAll() { return Clinic.find().sort({ name: 1 }); }
  async create(data: Record<string, unknown>) { return Clinic.create(data); }
  async update(id: string, data: Record<string, unknown>) { return Clinic.findByIdAndUpdate(id, data, { new: true }); }
  async createDepartment(data: Record<string, unknown>) { return Department.create(data); }
  async getDepartments(clinicId: string) { return Department.find({ clinicId }).sort({ name: 1 }); }
  async updateDepartment(id: string, data: Record<string, unknown>) { return Department.findByIdAndUpdate(id, data, { new: true }); }
}
