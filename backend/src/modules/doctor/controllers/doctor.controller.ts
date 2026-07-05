import { Request, Response, NextFunction } from "express";
import { DoctorService } from "../services/doctor.service.js";
import { sendSuccess } from "../../../shared/response.js";

const service = new DoctorService();

export async function createDoctor(req: Request, res: Response, next: NextFunction) {
  try {
    const doctor = await service.create(req.body);
    sendSuccess(res, doctor, "Doctor created", 201);
  } catch (e) { next(e); }
}

export async function getDoctor(req: Request, res: Response, next: NextFunction) {
  try {
    const doctor = await service.findById(req.params.id as string);
    sendSuccess(res, doctor);
  } catch (e) { next(e); }
}

export async function listDoctors(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const specialization = req.query.specialization as string | undefined;
    const result = await service.list({ page, limit, specialization });
    sendSuccess(res, result);
  } catch (e) { next(e); }
}

export async function updateDoctor(req: Request, res: Response, next: NextFunction) {
  try {
    const doctor = await service.update(req.params.id as string, req.body);
    sendSuccess(res, doctor, "Doctor updated");
  } catch (e) { next(e); }
}

export async function requestLeave(req: Request, res: Response, next: NextFunction) {
  try {
    const leave = await service.requestLeave(req.body);
    sendSuccess(res, leave, "Leave requested", 201);
  } catch (e) { next(e); }
}

export async function getLeaves(req: Request, res: Response, next: NextFunction) {
  try {
    const leaves = await service.getLeaves(req.params.doctorId as string);
    sendSuccess(res, { leaves });
  } catch (e) { next(e); }
}

export async function updateLeave(req: Request, res: Response, next: NextFunction) {
  try {
    const leave = await service.updateLeave(req.params.id as string, req.body);
    sendSuccess(res, leave, "Leave updated");
  } catch (e) { next(e); }
}
