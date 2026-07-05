import { Request, Response, NextFunction } from "express";
import { ReportService } from "../services/report.service.js";
import { sendSuccess } from "../../../shared/response.js";

const service = new ReportService();

export async function getDashboard(req: Request, res: Response, next: NextFunction) {
  try { const stats = await service.getDashboard(req.user?.clinicId); sendSuccess(res, stats); } catch (e) { next(e); }
}
export async function getRevenueReport(req: Request, res: Response, next: NextFunction) {
  try { const data = await service.getRevenue(req.user?.clinicId || "", req.query.from as string, req.query.to as string); sendSuccess(res, { data }); } catch (e) { next(e); }
}
export async function getAppointmentReport(req: Request, res: Response, next: NextFunction) {
  try { const data = await service.getAppointments(req.user?.clinicId || "", req.query.from as string, req.query.to as string); sendSuccess(res, { data }); } catch (e) { next(e); }
}
