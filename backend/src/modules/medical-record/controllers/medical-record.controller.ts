import { Request, Response, NextFunction } from "express";
import { MedicalRecordService } from "../services/medical-record.service.js";
import { sendSuccess } from "../../../shared/response.js";

const service = new MedicalRecordService();

export async function createRecord(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const record = await service.create(req.body);
    sendSuccess(res, record, "Medical record created", 201);
  } catch (error) {
    next(error);
  }
}

export async function getRecord(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const record = await service.findById(id);
    sendSuccess(res, record);
  } catch (error) {
    next(error);
  }
}

export async function getPatientRecords(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const patientId = req.params.patientId as string;
    const records = await service.findByPatientId(patientId);
    sendSuccess(res, { records });
  } catch (error) {
    next(error);
  }
}

export async function listRecords(req: Request, res: Response, next: NextFunction): Promise<void> {
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

export async function updateRecord(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const record = await service.update(id, req.body);
    sendSuccess(res, record, "Medical record updated");
  } catch (error) {
    next(error);
  }
}
