import { Request, Response, NextFunction } from "express";
import { NotificationService } from "../services/notification.service.js";
import { sendSuccess } from "../../../shared/response.js";

const service = new NotificationService();

export async function sendNotification(req: Request, res: Response, next: NextFunction) {
  try { const n = await service.send(req.body); sendSuccess(res, n, "Notification sent", 201); } catch (e) { next(e); }
}
export async function listNotifications(req: Request, res: Response, next: NextFunction) {
  try { const r = await service.list(req.user!.userId, parseInt(req.query.page as string) || 1, parseInt(req.query.limit as string) || 20); sendSuccess(res, r); } catch (e) { next(e); }
}
export async function markAsRead(req: Request, res: Response, next: NextFunction) {
  try { const n = await service.markAsRead(req.params.id as string); sendSuccess(res, n, "Marked as read"); } catch (e) { next(e); }
}
export async function markAllAsRead(req: Request, res: Response, next: NextFunction) {
  try { await service.markAllAsRead(req.user!.userId); sendSuccess(res, {}, "All marked as read"); } catch (e) { next(e); }
}
export async function getUnreadCount(req: Request, res: Response, next: NextFunction) {
  try { const count = await service.getUnreadCount(req.user!.userId); sendSuccess(res, { count }); } catch (e) { next(e); }
}
