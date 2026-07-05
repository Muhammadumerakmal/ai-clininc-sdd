import { Request, Response, NextFunction } from "express";
import { BillingService } from "../services/billing.service.js";
import { sendSuccess } from "../../../shared/response.js";

const service = new BillingService();

export async function createInvoice(req: Request, res: Response, next: NextFunction) {
  try { const inv = await service.createInvoice(req.body); sendSuccess(res, inv, "Invoice created", 201); } catch (e) { next(e); }
}
export async function getInvoice(req: Request, res: Response, next: NextFunction) {
  try { const inv = await service.findById(req.params.id as string); sendSuccess(res, inv); } catch (e) { next(e); }
}
export async function listInvoices(req: Request, res: Response, next: NextFunction) {
  try { const r = await service.list({ page: parseInt(req.query.page as string) || 1, limit: parseInt(req.query.limit as string) || 20, patientId: req.query.patientId as string, status: req.query.status as string }); sendSuccess(res, r); } catch (e) { next(e); }
}
export async function updateInvoice(req: Request, res: Response, next: NextFunction) {
  try { const inv = await service.updateStatus(req.params.id as string, req.body.status); sendSuccess(res, inv, "Invoice updated"); } catch (e) { next(e); }
}
export async function makePayment(req: Request, res: Response, next: NextFunction) {
  try { const p = await service.makePayment(req.body); sendSuccess(res, p, "Payment successful", 201); } catch (e) { next(e); }
}
export async function getPayments(req: Request, res: Response, next: NextFunction) {
  try { const payments = await service.getPayments(req.params.invoiceId as string); sendSuccess(res, { payments }); } catch (e) { next(e); }
}
