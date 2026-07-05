import { Request, Response, NextFunction } from "express";
import { PrescriptionService } from "../services/prescription.service.js";
import { sendSuccess } from "../../../shared/response.js";

const service = new PrescriptionService();

export async function createPrescription(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const prescription = await service.create(req.body);
    sendSuccess(res, prescription, "Prescription created", 201);
  } catch (error) {
    next(error);
  }
}

export async function getPrescription(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const prescription = await service.findById(id);
    sendSuccess(res, prescription);
  } catch (error) {
    next(error);
  }
}

export async function getPatientPrescriptions(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const patientId = req.params.patientId as string;
    const prescriptions = await service.findByPatientId(patientId);
    sendSuccess(res, { prescriptions });
  } catch (error) {
    next(error);
  }
}

export async function listPrescriptions(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const patientId = req.query.patientId as string | undefined;
    const doctorId = req.query.doctorId as string | undefined;

    const result = await service.list({ page, limit, patientId, doctorId });
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function approvePrescription(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const { approved } = req.body;
    const prescription = await service.approvePrescription(id, approved);
    sendSuccess(res, prescription, approved ? "Prescription approved" : "Prescription rejected");
  } catch (error) {
    next(error);
  }
}

export async function updatePrescription(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const prescription = await service.update(id, req.body);
    sendSuccess(res, prescription, "Prescription updated");
  } catch (error) {
    next(error);
  }
}
