import { Request, Response, NextFunction } from "express";
import { AIService } from "../services/ai.service.js";
import { sendSuccess } from "../../../shared/response.js";
import { assertUser } from "../../../middleware/auth.js";

const service = new AIService();

export async function chat(req: Request, res: Response, next: NextFunction) {
  try { const r = await service.chat(assertUser(req.user).userId, req.body.message); sendSuccess(res, r); } catch (e) { next(e); }
}
export async function analyzeSymptoms(req: Request, res: Response, next: NextFunction) {
  try { const r = await service.analyzeSymptoms(assertUser(req.user).userId, req.body.symptoms, req.body.patientId); sendSuccess(res, r); } catch (e) { next(e); }
}
export async function suggestDiagnosis(req: Request, res: Response, next: NextFunction) {
  try { const r = await service.suggestDiagnosis(assertUser(req.user).userId, req.body.symptoms, req.body.testResults, req.body.patientHistory); sendSuccess(res, r); } catch (e) { next(e); }
}
export async function draftPrescription(req: Request, res: Response, next: NextFunction) {
  try { const r = await service.draftPrescription(assertUser(req.user).userId, req.body.diagnosis, req.body.patientId, req.body.doctorId); sendSuccess(res, r); } catch (e) { next(e); }
}
