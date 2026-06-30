import { Request, Response, NextFunction } from "express";
import { LabService } from "../services/lab.service.js";
import { sendSuccess } from "../../../shared/response.js";

const service = new LabService();

export async function createLabOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const labOrder = await service.create(req.body);
    sendSuccess(res, labOrder, "Lab order created", 201);
  } catch (error) {
    next(error);
  }
}

export async function getLabOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const labOrder = await service.findById(id);
    sendSuccess(res, labOrder);
  } catch (error) {
    next(error);
  }
}

export async function listLabOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const patientId = req.query.patientId as string | undefined;
    const status = req.query.status as string | undefined;

    const result = await service.list({ page, limit, patientId, status });
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function updateLabOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const labOrder = await service.update(id, req.body);
    sendSuccess(res, labOrder, "Lab order updated");
  } catch (error) {
    next(error);
  }
}

export async function reviewLabOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const { reviewedByDoctor } = req.body;
    const labOrder = await service.review(id, reviewedByDoctor);
    sendSuccess(res, labOrder, "Lab order reviewed");
  } catch (error) {
    next(error);
  }
}
