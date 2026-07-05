import { Request, Response, NextFunction } from "express";
import { PharmacyService } from "../services/pharmacy.service.js";
import { sendSuccess } from "../../../shared/response.js";
import { assertUser } from "../../../middleware/auth.js";

const service = new PharmacyService();

export async function createMedicine(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const medicine = await service.createMedicine(req.body);
    sendSuccess(res, medicine, "Medicine created", 201);
  } catch (error) {
    next(error);
  }
}

export async function updateMedicine(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = req.params.id as string;
    const medicine = await service.updateMedicine(id, req.body);
    sendSuccess(res, medicine, "Medicine updated");
  } catch (error) {
    next(error);
  }
}

export async function listMedicines(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const category = req.query.category as string | undefined;
    const search = req.query.search as string | undefined;

    const result = await service.listMedicines({ page, limit, category, search });
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function getLowStock(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const medicines = await service.getLowStock();
    sendSuccess(res, { medicines });
  } catch (error) {
    next(error);
  }
}

export async function dispense(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = { ...req.body, pharmacistId: assertUser(req.user).userId };
    const dispensation = await service.dispense(data);
    sendSuccess(res, dispensation, "Medicine dispensed", 201);
  } catch (error) {
    next(error);
  }
}
