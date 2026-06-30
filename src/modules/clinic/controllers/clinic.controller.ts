import { Request, Response, NextFunction } from "express";
import { ClinicService } from "../services/clinic.service.js";
import { sendSuccess } from "../../../shared/response.js";

const service = new ClinicService();

export async function createClinic(req: Request, res: Response, next: NextFunction) {
  try { const c = await service.create(req.body); sendSuccess(res, c, "Clinic created", 201); } catch (e) { next(e); }
}
export async function getClinic(req: Request, res: Response, next: NextFunction) {
  try { const c = await service.findById(req.params.id as string); sendSuccess(res, c); } catch (e) { next(e); }
}
export async function listClinics(_req: Request, res: Response, next: NextFunction) {
  try { const clinics = await service.findAll(); sendSuccess(res, { clinics }); } catch (e) { next(e); }
}
export async function updateClinic(req: Request, res: Response, next: NextFunction) {
  try { const c = await service.update(req.params.id as string, req.body); sendSuccess(res, c, "Clinic updated"); } catch (e) { next(e); }
}
export async function createDepartment(req: Request, res: Response, next: NextFunction) {
  try { const d = await service.createDepartment(req.body); sendSuccess(res, d, "Department created", 201); } catch (e) { next(e); }
}
export async function getDepartments(req: Request, res: Response, next: NextFunction) {
  try { const departments = await service.getDepartments(req.params.clinicId as string); sendSuccess(res, { departments }); } catch (e) { next(e); }
}
export async function updateDepartment(req: Request, res: Response, next: NextFunction) {
  try { const d = await service.updateDepartment(req.params.id as string, req.body); sendSuccess(res, d, "Department updated"); } catch (e) { next(e); }
}
