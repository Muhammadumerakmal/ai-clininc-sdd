import { Request, Response, NextFunction } from "express";
import { PatientService } from "../services/patient.service.js";
import { sendSuccess } from "../../../shared/response.js";

const patientService = new PatientService();

export async function createPatient(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const clinicId = req.body.clinicId || req.user?.clinicId;
    if (!clinicId) {
      res.status(400).json({ success: false, message: "Clinic ID is required" });
      return;
    }
    const data = { ...req.body, clinicId };
    const patient = await patientService.create(data);
    sendSuccess(res, patient, "Patient created successfully", 201);
  } catch (error) {
    next(error);
  }
}

export async function getPatient(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const patient = await patientService.findById(id);
    sendSuccess(res, patient);
  } catch (error) {
    next(error);
  }
}

export async function updatePatient(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const patient = await patientService.update(id, req.body);
    sendSuccess(res, patient, "Patient updated successfully");
  } catch (error) {
    next(error);
  }
}

export async function listPatients(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string | undefined;
    const clinicId = (req.query.clinicId as string) || req.user?.clinicId;

    const result = await patientService.list({ page, limit, search, clinicId });
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function searchPatients(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const query = req.query.q as string;
    if (!query) {
      sendSuccess(res, { patients: [] });
      return;
    }
    const patients = await patientService.search(query, req.user?.clinicId);
    sendSuccess(res, { patients });
  } catch (error) {
    next(error);
  }
}
